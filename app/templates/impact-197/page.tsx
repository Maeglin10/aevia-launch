// @ts-nocheck
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { Globe, Compass, Star, MapPin, Phone, Mail, Camera, MessageSquare, Users2, Menu, X, ChevronRight, Shield, Clock, Award, Users, Plane, Anchor, Mountain, Heart, Check, ArrowRight, ChevronDown, Calendar, Headphones, Gem, Leaf } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const C = {
  bg: "#FBF7EF",
  bgDark: "#0A2540",
  bgCard: "#FFFFFF",
  text: "#0A2540",
  textMuted: "#6B7B8D",
  textLight: "rgba(10,37,64,0.55)",
  accent: "#C9A96E",
  accentDark: "#9E7A45",
  accentLight: "#F0E6D3",
  marine: "#0A2540",
  marineMid: "#1A3A5C",
  sand: "#FBF7EF",
  sandDark: "#F0E6D3",
  white: "#FFFFFF",
  border: "rgba(201,169,110,0.2)",
  borderLight: "rgba(10,37,64,0.08)",
};

const DESTINATIONS = [
  { name: "Maldives Privées", region: "Océan Indien", img: "photo-1514282401047-d79a71a590e8", duration: "10 nuits", price: "À partir de 12 400 €", tag: "Sérénité absolue", icon: Anchor, desc: "Villas sur pilotis, lagon turquoise privé, plongée de corail — l'archipel d'exception." },
  { name: "Kyoto Impériale", region: "Japon", img: "photo-1528360983277-13d401cdc186", duration: "12 nuits", price: "À partir de 9 800 €", tag: "Patrimoine vivant", icon: Leaf, desc: "Ryokans historiques, cérémonie du thé privée, géishas et jardins zen au lever du soleil." },
  { name: "Safari Masaï Mara", region: "Kenya", img: "photo-1516426122078-c23e76319801", duration: "9 nuits", price: "À partir de 14 200 €", tag: "Grande migration", icon: Mountain, desc: "Camp de luxe privé, safaris au lever du soleil, bush dinner sous les étoiles africaines." },
  { name: "Patagonie Sauvage", region: "Argentine & Chili", img: "photo-1501854140801-50d01698950b", duration: "14 nuits", price: "À partir de 8 900 €", tag: "Bout du monde", icon: Compass, desc: "Torres del Paine, glaciers Perito Moreno, lodges isolés au cœur d'une nature absolue." },
  { name: "Grèce des Cyclades", region: "Méditerranée", img: "photo-1533105079780-92b9be482077", duration: "8 nuits", price: "À partir de 7 600 €", tag: "Lumière dorée", icon: Anchor, desc: "Santorin, Mykonos, Folegandros — voilier privatisé et îles secrètes hors des sentiers battus." },
  { name: "Rajasthan Royal", region: "Inde du Nord", img: "photo-1524492412937-b28074a5d7da", duration: "11 nuits", price: "À partir de 6 400 €", tag: "Fastes de l'Orient", icon: Gem, desc: "Palace hotels historiques, Jaipur, Udaipur, Jaisalmer — un voyage dans un voyage." },
];

const PACKAGES = [
  {
    name: "Évasion",
    subtitle: "Le voyage essentiel",
    price: "À partir de 4 900 €",
    perPerson: "par personne",
    color: C.marineMid,
    features: [
      "Vol en classe affaires",
      "Hébergement 5 étoiles sélectionné",
      "Transferts privés aéroport",
      "Petit-déjeuner gastronomique inclus",
      "Guide local francophone",
      "Assistance voyage 6j/7",
    ],
    cta: "Découvrir",
  },
  {
    name: "Prestige",
    subtitle: "L'expérience signature",
    price: "À partir de 8 200 €",
    perPerson: "par personne",
    featured: true,
    color: C.accent,
    features: [
      "Vol en première classe",
      "Suite ou villa de luxe",
      "Transferts en véhicule premium",
      "Pension complète gastronomique",
      "Concierge privé dédié 24h/24",
      "2 expériences exclusives incluses",
      "Service bagagerie domicile",
    ],
    cta: "Réserver",
  },
  {
    name: "Excellence",
    subtitle: "Sur mesure absolu",
    price: "Sur devis",
    perPerson: "personnalisé",
    color: C.marine,
    features: [
      "Jet privé affrété",
      "Château ou propriété exclusive",
      "Équipe dédiée à votre service",
      "Expériences uniques au monde",
      "Chef étoilé privé à bord",
      "Conciergerie 24h/24 internationale",
      "Accès aux lieux les plus secrets",
    ],
    cta: "Nous contacter",
  },
];

const STATS = [
  { val: "1 200+", label: "Voyageurs accompagnés", suffix: "" },
  { val: "87", label: "Destinations maîtrisées", suffix: "+" },
  { val: "4.97", label: "Note moyenne clients", suffix: "/5" },
  { val: "18", label: "Années d'expertise", suffix: "" },
];

const TESTIMONIALS = [
  {
    name: "Hélène & Bertrand Favre",
    origin: "Lyon",
    trip: "Maldives Privées, 10 nuits",
    rating: 5,
    text: "Évasion Dorée a transformé notre voyage de noces en quelque chose d'absolument irréel. La villa sur pilotis, le dîner privé sur le lagon au coucher du soleil, la plongée avec les raies mantas… chaque détail était parfait.",
    avatar: "HF",
  },
  {
    name: "Jean-Philippe Moreau",
    origin: "Paris",
    trip: "Japon Imperial, 12 nuits",
    rating: 5,
    text: "Je voyage beaucoup pour mes affaires, mais jamais comme ça. L'accès au ryokan centenaire, la cérémonie du thé privée avec une maîtresse de thé octogénaire — c'est le genre d'expérience qu'on ne trouve pas seul.",
    avatar: "JM",
  },
  {
    name: "Camille Aubert",
    origin: "Bordeaux",
    trip: "Safari Kenya, 9 nuits",
    rating: 5,
    text: "La grande migration en exclusivité depuis notre camp de luxe… Les guides parlaient français couramment, les ballades au lever du soleil dans la savane, et le bush dinner sous les étoiles. Une vie, un voyage.",
    avatar: "CA",
  },
  {
    name: "Marc & Isabelle Delacroix",
    origin: "Genève",
    trip: "Grèce des Cyclades, 8 nuits",
    rating: 5,
    text: "Le voilier privatisé était une idée absolument parfaite. Santorin sans les foules à l'aube, Folegandros que personne ne connaît, une baie secrète à Amorgos… Évasion Dorée connaît vraiment la Grèce.",
    avatar: "MD",
  },
  {
    name: "Laurence Petit",
    origin: "Toulouse",
    trip: "Rajasthan Royal, 11 nuits",
    rating: 5,
    text: "Le palace hotel d'Udaipur sur le lac, le dîner aux chandelles dans un palais du XVIème siècle… Je m'attendais à du beau, j'ai eu du sublime. Leur concierge m'a obtenu un accès à des quartiers inaccessibles au public.",
    avatar: "LP",
  },
  {
    name: "Antoine Rousseau",
    origin: "Nantes",
    trip: "Patagonie, 14 nuits",
    rating: 5,
    text: "Patagonie avec lodge privatisé, randonnées guidées dans Torres del Paine au lever du soleil, et le glacier Perito Moreno en bateau privé. Évasion Dorée m'a envoyé au bout du monde avec une organisation sans faille.",
    avatar: "AR",
  },
];

const SERVICES_DETAIL = [
  { icon: Compass, title: "Conception sur mesure", desc: "Chaque itinéraire est créé de zéro selon vos désirs, votre rythme et vos passions. Aucun voyage n'est jamais identique." },
  { icon: Gem, title: "Accès ultra-exclusifs", desc: "Palaces, villas privées, accès VIP à des sites fermés au public — notre carnet d'adresses s'ouvre là où les agences classiques n'entrent pas." },
  { icon: Headphones, title: "Conciergerie 24h/24", desc: "Un interlocuteur francophone dédié, joignable à toute heure, dans tous les fuseaux horaires. Parce que l'imprévu n'attend pas." },
  { icon: Shield, title: "Garantie tranquillité", desc: "Assurance annulation premium, rapatriement toutes causes, protection juridique internationale — voyagez sans arrière-pensée." },
  { icon: Plane, title: "Classe affaires garantie", desc: "Tous nos vols longue durée sont en classe affaires ou première. Votre voyage commence à l'aéroport." },
  { icon: Award, title: "Sélection hôtelière", desc: "Chaque hébergement est visité et validé par notre équipe. Seuls les 5% les plus exceptionnels intègrent notre carnet." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Consultation découverte", desc: "Un appel de 30 minutes avec votre conseiller dédié pour comprendre vos envies, votre style de voyage, votre budget et vos contraintes." },
  { num: "02", title: "Proposition personnalisée", desc: "Sous 72h, vous recevez 2 à 3 itinéraires sur mesure avec détail des hébergements, expériences et tarifs transparents." },
  { num: "03", title: "Affinage et validation", desc: "Nous peaufinons ensemble chaque détail jusqu'à ce que l'itinéraire soit exactement ce que vous imaginiez — sans compromis." },
  { num: "04", title: "Départ et suivi", desc: "Votre concierge est joignable 24h/24 tout au long du voyage. Retours, imprévus, demandes de dernière minute — nous gérons tout." },
];

const FAQS = [
  { q: "Quel est le budget minimum pour vos voyages ?", a: "Nos voyages sur mesure débutent à partir de 4 900 € par personne (vol en classe affaires inclus). Pour les formules Excellence avec jet privé, comptez 25 000 € et au-delà. Nous adaptons chaque voyage au budget annoncé avec transparence totale." },
  { q: "Combien de temps à l'avance dois-je réserver ?", a: "Idéalement 3 à 6 mois pour les haute saisons (été, Noël, Nouvel An). Pour les destinations très demandées comme les Maldives ou le Japon en sakura, 8 à 12 mois sont recommandés. Nous pouvons parfois créer des voyages express en 3 semaines." },
  { q: "Proposez-vous des voyages en famille ?", a: "Absolument. Nous sommes spécialistes des voyages familiaux luxury : villas privées avec personnel dédié, activités adaptées à chaque âge, babysitters certifiés, menus enfants gastronomiques. Voyager en famille n'est pas un compromis, c'est une autre forme d'excellence." },
  { q: "Que comprend votre service de conciergerie 24h/24 ?", a: "Votre concierge est joignable par téléphone, WhatsApp et email en permanence pendant le voyage. Il peut modifier des réservations, gérer un incident médical, organiser une surprise pour un anniversaire ou simplement vous recommander le meilleur restaurant du soir." },
  { q: "Gérez-vous les visas et formalités ?", a: "Oui, nous prenons en charge l'ensemble des formalités : demandes de visas, assurances voyages, tests PCR si requis, enregistrement dans les ambassades, lettres d'invitation. Vous n'avez qu'à faire vos valises." },
  { q: "Puis-je combiner plusieurs destinations ?", a: "C'est même notre spécialité. Les circuits multi-destinations — Japon + Bali, Maroc + Portugal, Afrique du Sud + Mozambique — sont au cœur de notre savoir-faire. Nous optimisons les connexions et rythmez le voyage pour éviter toute fatigue." },
];

// Signature element: World Map SVG avec destinations marquées
function WorldMapSignature() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const destinations = [
    { id: "maldives", x: "67%", y: "58%", label: "Maldives", region: "Océan Indien" },
    { id: "kyoto", x: "80%", y: "38%", label: "Kyoto", region: "Japon" },
    { id: "kenya", x: "57%", y: "60%", label: "Kenya", region: "Afrique de l'Est" },
    { id: "patagonia", x: "28%", y: "82%", label: "Patagonie", region: "Amérique du Sud" },
    { id: "greece", x: "52%", y: "38%", label: "Grèce", region: "Méditerranée" },
    { id: "rajasthan", x: "66%", y: "43%", label: "Rajasthan", region: "Inde" },
    { id: "peru", x: "26%", y: "70%", label: "Pérou", region: "Amérique du Sud" },
    { id: "iceland", x: "44%", y: "22%", label: "Islande", region: "Europe du Nord" },
  ];

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Simplified world map silhouette */}
      <svg viewBox="0 0 900 480" style={{ width: "100%", height: "auto", opacity: isInView ? 1 : 0, transition: "opacity 1s ease 0.3s" }}>
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Ocean background */}
        <rect width="900" height="480" fill={C.marineMid} rx="16" opacity="0.06" />

        {/* Continents — simplified paths */}
        {/* North America */}
        <path d="M80 80 L200 60 L240 100 L220 160 L180 200 L140 220 L100 180 L70 140 Z" fill={C.marine} opacity="0.18" />
        {/* South America */}
        <path d="M150 280 L200 260 L230 300 L220 380 L190 420 L160 400 L140 350 Z" fill={C.marine} opacity="0.18" />
        {/* Europe */}
        <path d="M400 80 L480 70 L510 100 L490 150 L450 160 L410 140 L390 110 Z" fill={C.marine} opacity="0.18" />
        {/* Africa */}
        <path d="M430 190 L510 180 L540 230 L530 320 L490 380 L450 370 L420 300 L410 230 Z" fill={C.marine} opacity="0.18" />
        {/* Asia */}
        <path d="M510 70 L750 60 L790 130 L740 200 L650 210 L560 180 L520 140 Z" fill={C.marine} opacity="0.18" />
        {/* Australia */}
        <path d="M700 300 L790 290 L820 340 L790 390 L720 390 L690 350 Z" fill={C.marine} opacity="0.18" />

        {/* Connection lines between destinations */}
        {destinations.slice(0, -2).map((d, i) => {
          const next = destinations[i + 1];
          return (
            <motion.line
              key={d.id}
              x1={`${parseFloat(d.x) * 9}`}
              y1={`${parseFloat(d.y) * 4.8}`}
              x2={`${parseFloat(next.x) * 9}`}
              y2={`${parseFloat(next.y) * 4.8}`}
              stroke={C.accent}
              strokeWidth="0.8"
              strokeDasharray="4 6"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, delay: i * 0.25, ease: "easeInOut" }}
            />
          );
        })}

        {/* Destination pins */}
        {destinations.map((dest, i) => (
          <motion.g
            key={dest.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: "backOut" }}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setActiveRegion(dest.id)}
            onMouseLeave={() => setActiveRegion(null)}
          >
            <circle
              cx={`${parseFloat(dest.x) * 9}`}
              cy={`${parseFloat(dest.y) * 4.8}`}
              r={activeRegion === dest.id ? "10" : "6"}
              fill={activeRegion === dest.id ? C.accent : "transparent"}
              stroke={C.accent}
              strokeWidth="2"
              style={{ transition: "all 0.3s" }}
            />
            <circle
              cx={`${parseFloat(dest.x) * 9}`}
              cy={`${parseFloat(dest.y) * 4.8}`}
              r="2"
              fill={C.accent}
            />
            {activeRegion === dest.id && (
              <g>
                <rect
                  x={`${parseFloat(dest.x) * 9 - 50}`}
                  y={`${parseFloat(dest.y) * 4.8 - 40}`}
                  width="100"
                  height="28"
                  rx="4"
                  fill={C.marine}
                  opacity="0.95"
                />
                <text
                  x={`${parseFloat(dest.x) * 9}`}
                  y={`${parseFloat(dest.y) * 4.8 - 22}`}
                  textAnchor="middle"
                  fill={C.white}
                  fontSize="10"
                  fontFamily="system-ui"
                >
                  {dest.label}
                </text>
              </g>
            )}
          </motion.g>
        ))}
      </svg>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: C.textMuted, fontFamily: "system-ui", letterSpacing: "0.06em" }}>
        {activeRegion
          ? destinations.find(d => d.id === activeRegion)?.region
          : "87+ destinations — survolez pour explorer"}
      </div>
    </div>
  );
}

function CounterStat({ value, label, suffix }: { value: string; label: string; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: "center" }}
    >
      <div style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, color: C.accent, letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, fontFamily: "system-ui", marginTop: 8, letterSpacing: "0.04em" }}>{label}</div>
    </motion.div>
  );
}

function RevealSection({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
  };
  return (
    <motion.div
      ref={ref}
      initial={variants[direction].initial}
      animate={isInView ? variants[direction].animate : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type ActivePage = "home" | "destinations" | "concept" | "formules" | "legal";

export default function EvasionDoree() {
  const [page, setPage] = useState<ActivePage>("home");
  const goTo = (p: ActivePage) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState(0);
  const [activePkg, setActivePkg] = useState(1);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const NAV_LINKS = ["Destinations", "Services", "Processus", "Avis", "Tarifs"];
  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'Cormorant Garamond', Georgia, serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.sandDark}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 3px; }
      `}</style>

      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(251,247,239,0.92)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.borderLight}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={(e) => { e.preventDefault(); goTo("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <Compass size={22} color={C.accent} />
            <span style={{ fontSize: 22, fontWeight: 400, letterSpacing: "0.08em", color: C.marine }}>Évasion Dorée</span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[
              { name: "Accueil", page: "home" },
              { name: "Destinations", page: "destinations" },
              { name: "Concept", page: "concept" },
              { name: "Formules", page: "formules" },
            ].map(link => (
              <a
                key={link.name}
                href={`#${link.page}`}
                onClick={(e) => { e.preventDefault(); goTo(link.page as any); }}
                style={{ fontSize: 13, color: page === link.page ? C.accent : C.textMuted, textDecoration: "none", fontFamily: "system-ui", letterSpacing: "0.04em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = page === link.page ? C.accent : C.textMuted)}
              >
                {link.name}
              </a>
            ))}
            <motion.button
              onClick={() => goTo("formules")}
              whileHover={{ scale: 1.03, boxShadow: `0 6px 24px rgba(201,169,110,0.35)` }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "11px 28px", background: C.marine, color: C.white, border: "none", borderRadius: 3, fontSize: 12, fontFamily: "system-ui", fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer" }}
            >
              CONSULTATION
            </motion.button>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.marine, display: "none" }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {page === "home" && (
        <>
          {/* HERO */}
      <section
        ref={heroRef}
        style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", display: "flex", alignItems: "center" }}
      >
        <motion.div style={{ position: "absolute", inset: 0, y: heroY, scale: heroScale }}>
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1800&q=85)`,
              backgroundSize: "cover", backgroundPosition: "center",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(10,37,64,0.82) 40%, rgba(10,37,64,0.25) 100%)` }} />
        </motion.div>

        {/* Grain texture overlay */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        <motion.div style={{ position: "relative", zIndex: 10, maxWidth: 1320, margin: "0 auto", padding: "0 60px", width: "100%", opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 40, padding: "6px 16px", marginBottom: 36 }}>
              <Gem size={12} color={C.accent} />
              <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 500 }}>AGENCE VOYAGE LUXURY DEPUIS 2006</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(48px, 7.5vw, 110px)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", color: C.white, marginBottom: 28, maxWidth: 800 }}
          >
            Le monde<br />
            <em style={{ color: C.accent, fontStyle: "italic" }}>autrement.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.65)", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 48, maxWidth: 520, fontWeight: 300 }}
          >
            Voyages sur mesure en classe affaires et première. Expériences exclusives inaccessibles au grand public. Conciergerie 24h/24 sur tous les continents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(201,169,110,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: "18px 40px", background: C.accent, color: C.marine, border: "none", borderRadius: 3, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}
            >
              CRÉER MON VOYAGE
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.6)" }}
              style={{ padding: "18px 40px", background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 3, fontSize: 13, fontFamily: "system-ui", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              DÉCOUVRIR NOS DESTINATIONS <ChevronRight size={14} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero floating card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            position: "absolute", right: 80, bottom: 100, zIndex: 10,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(201,169,110,0.3)", borderRadius: 16,
            padding: "24px 28px", minWidth: 220,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "system-ui", letterSpacing: "0.08em" }}>CONCIERGE EN LIGNE</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 300, color: C.accent }}>1 200+</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "system-ui", marginTop: 4 }}>voyageurs accompagnés</div>
          <div style={{ marginTop: 20, display: "flex", gap: 4 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={C.accent} color={C.accent} />)}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "system-ui", marginLeft: 6 }}>4.97/5</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "system-ui", letterSpacing: "0.12em" }}>SCROLL</span>
          <ChevronDown size={16} color="rgba(255,255,255,0.35)" />
        </motion.div>
      </section>

      {/* STATS BAND */}
      <section style={{ background: C.marine, padding: "56px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {STATS.map((stat, i) => (
            <RevealSection key={i} delay={i * 0.12}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, color: C.accent, letterSpacing: "-0.02em" }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "system-ui", marginTop: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* DESTINATIONS GRID */}
      <section id="destinations" style={{ padding: "140px 40px", background: C.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ marginBottom: 80 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: C.accent }} />
                <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>NOS DESTINATIONS</span>
              </div>
              <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, letterSpacing: "-0.02em", color: C.marine, lineHeight: 1.05, maxWidth: 620 }}>
                Chaque destination,<br /><em style={{ color: C.accent, fontStyle: "italic" }}>une révélation.</em>
              </h2>
            </div>
          </RevealSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 80 }}>
            {DESTINATIONS.map((dest, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderRadius: 16, overflow: "hidden", background: C.white,
                    boxShadow: "0 4px 24px rgba(10,37,64,0.06)",
                    border: `1px solid ${C.borderLight}`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setActiveDestination(i)}
                >
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6 }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <div
                        style={{
                          width: "100%", height: "100%",
                          backgroundImage: `url(https://images.unsplash.com/${dest.img}?w=600&q=85)`,
                          backgroundSize: "cover", backgroundPosition: "center",
                        }}
                      />
                    </motion.div>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,37,64,0.7) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", top: 16, left: 16 }}>
                      <span style={{ background: "rgba(201,169,110,0.9)", color: C.marine, fontSize: 10, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 10px", borderRadius: 20 }}>
                        {dest.tag}
                      </span>
                    </div>
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <MapPin size={12} color={C.accent} />
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "system-ui" }}>{dest.region}</span>
                      </div>
                      <h3 style={{ fontSize: 22, fontWeight: 400, color: C.white, letterSpacing: "0.01em" }}>{dest.name}</h3>
                    </div>
                  </div>
                  <div style={{ padding: "22px 24px" }}>
                    <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 20 }}>{dest.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={13} color={C.textMuted} />
                        <span style={{ fontSize: 13, color: C.textMuted, fontFamily: "system-ui" }}>{dest.duration}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, fontFamily: "system-ui" }}>{dest.price}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>

          <RevealSection>
            <div style={{ textAlign: "center" }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: `0 8px 32px rgba(10,37,64,0.12)` }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "16px 44px", background: "transparent", color: C.marine, border: `1px solid ${C.marine}`, borderRadius: 3, fontSize: 12, fontFamily: "system-ui", fontWeight: 600, letterSpacing: "0.12em", cursor: "pointer" }}
              >
                VOIR LES 87 DESTINATIONS
              </motion.button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CARTE MONDE — SIGNATURE ELEMENT */}
      <section style={{ padding: "120px 40px", background: C.sandDark }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: C.accent }} />
                <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>CARTE DES DESTINATIONS</span>
                <div style={{ width: 24, height: 1, background: C.accent }} />
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, color: C.marine, marginBottom: 16 }}>
                Votre monde,<br /><em style={{ color: C.accent, fontStyle: "italic" }}>cartographié</em>
              </h2>
              <p style={{ fontSize: 15, color: C.textMuted, fontFamily: "system-ui", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
                Survolez la carte pour explorer nos destinations signature. 87 expériences uniques sur 6 continents.
              </p>
            </div>
          </RevealSection>

          <WorldMapSignature />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "140px 40px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <RevealSection direction="left">
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <div style={{ width: 24, height: 1, background: C.accent }} />
                  <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>NOS SERVICES</span>
                </div>
                <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 300, letterSpacing: "-0.02em", color: C.marine, lineHeight: 1.1, marginBottom: 24 }}>
                  Le privilège d'un<br /><em style={{ color: C.accent, fontStyle: "italic" }}>service sans égal</em>
                </h2>
                <p style={{ fontSize: 16, color: C.textMuted, fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 36 }}>
                  De la conception de votre itinéraire à votre retour à la maison, chaque détail est orchestré avec une précision absolue.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: `0 8px 24px rgba(201,169,110,0.3)` }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: "15px 36px", background: C.accent, color: C.marine, border: "none", borderRadius: 3, fontSize: 12, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  CONSULTATION GRATUITE <ArrowRight size={14} />
                </motion.button>
              </div>
            </RevealSection>

            <RevealSection direction="right">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {SERVICES_DETAIL.map((service, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(10,37,64,0.1)" }}
                    style={{
                      background: C.white, borderRadius: 12, padding: "24px 20px",
                      border: `1px solid ${C.borderLight}`,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <service.icon size={20} color={C.accent} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 500, color: C.marine, marginBottom: 8, lineHeight: 1.3 }}>{service.title}</h3>
                    <p style={{ fontSize: 13, color: C.textMuted, fontFamily: "system-ui", lineHeight: 1.65 }}>{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section id="processus" style={{ padding: "140px 40px", background: C.marine }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: 96 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div style={{ width: 24, height: 1, background: "rgba(201,169,110,0.5)" }} />
                <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>COMMENT ÇA MARCHE</span>
                <div style={{ width: 24, height: 1, background: "rgba(201,169,110,0.5)" }} />
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 300, color: C.white, letterSpacing: "-0.02em" }}>
                De l'idée au<br /><em style={{ color: C.accent, fontStyle: "italic" }}>voyage inoubliable</em>
              </h2>
            </div>
          </RevealSection>

          <div style={{ position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 32, left: "calc(12.5% + 16px)", right: "calc(12.5% + 16px)", height: 1, background: `linear-gradient(90deg, ${C.accent} 0%, rgba(201,169,110,0.2) 100%)`, display: "none" }} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
              {PROCESS_STEPS.map((step, i) => (
                <RevealSection key={i} delay={i * 0.12}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1px solid rgba(201,169,110,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", position: "relative" }}>
                      <span style={{ fontSize: 13, color: C.accent, fontFamily: "system-ui", fontWeight: 600, letterSpacing: "0.06em" }}>{step.num}</span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 400, color: C.white, marginBottom: 16, lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "system-ui", lineHeight: 1.75 }}>{step.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="avis" style={{ padding: "140px 40px", background: C.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ marginBottom: 72 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: C.accent }} />
                <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>AVIS VOYAGEURS</span>
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 300, color: C.marine, letterSpacing: "-0.02em", maxWidth: 540 }}>
                Ils ont voyagé avec<br /><em style={{ color: C.accent, fontStyle: "italic" }}>Évasion Dorée</em>
              </h2>
            </div>
          </RevealSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.slice(0, 6).map((t, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(10,37,64,0.1)" }}
                  style={{
                    background: C.white, borderRadius: 16, padding: "32px 28px",
                    border: `1px solid ${C.borderLight}`, cursor: "pointer",
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={13} fill={C.accent} color={C.accent} />
                    ))}
                  </div>
                  <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.accent, fontFamily: "system-ui" }}>{t.avatar}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.marine }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "system-ui" }}>{t.trip}</div>
                    </div>
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES / TARIFS */}
      <section id="tarifs" style={{ padding: "140px 40px", background: C.sandDark }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: C.accent }} />
                <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>NOS FORMULES</span>
                <div style={{ width: 24, height: 1, background: C.accent }} />
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 300, color: C.marine, letterSpacing: "-0.02em", marginBottom: 20 }}>
                Choisissez votre<br /><em style={{ color: C.accent, fontStyle: "italic" }}>niveau d'excellence</em>
              </h2>
              <p style={{ fontSize: 15, color: C.textMuted, fontFamily: "system-ui", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
                Trois formules pour répondre à chaque aspiration. Chacune entièrement personnalisable selon votre voyage.
              </p>
            </div>
          </RevealSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {PACKAGES.map((pkg, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: pkg.featured ? "0 32px 80px rgba(201,169,110,0.25)" : "0 16px 48px rgba(10,37,64,0.12)" }}
                  style={{
                    borderRadius: 16, overflow: "hidden",
                    background: pkg.featured ? C.marine : C.white,
                    border: pkg.featured ? `1px solid rgba(201,169,110,0.3)` : `1px solid ${C.borderLight}`,
                    position: "relative", cursor: "pointer",
                  }}
                >
                  {pkg.featured && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, #D4B483)` }} />
                  )}
                  <div style={{ padding: "36px 32px" }}>
                    {pkg.featured && (
                      <div style={{ display: "inline-block", background: "rgba(201,169,110,0.15)", color: C.accent, fontSize: 10, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.12em", padding: "4px 12px", borderRadius: 20, marginBottom: 16 }}>
                        LE PLUS CHOISI
                      </div>
                    )}
                    <h3 style={{ fontSize: 28, fontWeight: 300, color: pkg.featured ? C.white : C.marine, marginBottom: 6 }}>{pkg.name}</h3>
                    <p style={{ fontSize: 13, color: pkg.featured ? "rgba(255,255,255,0.45)" : C.textMuted, fontFamily: "system-ui", marginBottom: 28 }}>{pkg.subtitle}</p>
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 300, color: pkg.featured ? C.accent : C.marine }}>{pkg.price}</div>
                      <div style={{ fontSize: 12, color: pkg.featured ? "rgba(255,255,255,0.35)" : C.textMuted, fontFamily: "system-ui", marginTop: 4 }}>{pkg.perPerson}</div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                      {pkg.features.map((feature, j) => (
                        <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: pkg.featured ? "rgba(255,255,255,0.7)" : C.textMuted, fontFamily: "system-ui", lineHeight: 1.5 }}>
                          <Check size={14} color={C.accent} style={{ marginTop: 1, flexShrink: 0 }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: "100%", padding: "14px",
                        background: pkg.featured ? C.accent : "transparent",
                        color: pkg.featured ? C.marine : C.accent,
                        border: pkg.featured ? "none" : `1px solid ${C.accent}`,
                        borderRadius: 3, fontSize: 12, fontFamily: "system-ui", fontWeight: 700,
                        letterSpacing: "0.1em", cursor: "pointer",
                      }}
                    >
                      {pkg.cta}
                    </motion.button>
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "120px 40px", background: C.bg }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: C.accent }} />
                <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>QUESTIONS FRÉQUENTES</span>
                <div style={{ width: 24, height: 1, background: C.accent }} />
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, color: C.marine, letterSpacing: "-0.02em" }}>
                Tout ce que vous<br /><em style={{ color: C.accent, fontStyle: "italic" }}>souhaitez savoir</em>
              </h2>
            </div>
          </RevealSection>

          <Accordion type="single" collapsible style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((faq, i) => (
              <RevealSection key={i} delay={i * 0.06}>
                <AccordionItem
                  value={`faq-${i}`}
                  style={{ border: `1px solid ${C.borderLight}`, borderRadius: 12, overflow: "hidden", background: C.white }}
                >
                  <AccordionTrigger
                    style={{ padding: "22px 28px", fontSize: 16, fontWeight: 400, color: C.marine, textAlign: "left", fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    style={{ padding: "0 28px 22px", fontSize: 14, color: C.textMuted, fontFamily: "system-ui", lineHeight: 1.8 }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </RevealSection>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "140px 40px", background: C.marine, position: "relative", overflow: "hidden" }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "rgba(201,169,110,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(201,169,110,0.03)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <RevealSection>
            <div style={{ marginBottom: 24 }}>
              <Compass size={48} color={C.accent} />
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 300, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 24 }}>
              Votre prochaine<br /><em style={{ color: C.accent, fontStyle: "italic" }}>grande évasion</em><br />commence ici.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontFamily: "system-ui", lineHeight: 1.8, marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
              Consultation gratuite de 30 minutes. Un conseiller dédié. Votre itinéraire personnalisé sous 72h.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(201,169,110,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "18px 44px", background: C.accent, color: C.marine, border: "none", borderRadius: 3, fontSize: 13, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}
              >
                CONSULTATION GRATUITE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.6)" }}
                style={{ padding: "18px 44px", background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 3, fontSize: 13, fontFamily: "system-ui", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              >
                <Phone size={14} /> NOUS APPELER
              </motion.button>
            </div>
          </RevealSection>
        </div>
      </section>

        </>
      )}

      {page === "destinations" && <DestinationsPage goTo={goTo} />}
      {page === "concept" && <ConceptPage goTo={goTo} />}
      {page === "formules" && <FormulesPage />}
      {page === "legal" && <LegalPage />}

      {/* FOOTER */}
      <footer style={{ background: "#050F1A", padding: "72px 40px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Compass size={20} color={C.accent} />
                <span style={{ fontSize: 20, fontWeight: 400, color: C.white, letterSpacing: "0.08em" }}>Évasion Dorée</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
                Agence de voyages de luxe sur mesure depuis 2006. Paris · Genève · Monaco. IATA 88-2-0456.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[Camera, MessageSquare, Users2].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(201,169,110,0.2)" }}
                    style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Icon size={16} color="rgba(255,255,255,0.4)" />
                  </motion.div>
                ))}
              </div>
            </div>

            {[
              { title: "Destinations", links: ["Maldives", "Japon", "Kenya", "Patagonie", "Grèce", "Rajasthan"] },
              { title: "Services", links: ["Voyages sur mesure", "Classe affaires", "Conciergerie 24h", "Voyages famille", "Lune de miel"] },
              { title: "Contact", links: ["Consultation gratuite", "+33 1 42 68 90 00", "paris@evasion-doree.fr", "Mentions légales", "CGV"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: C.accent, letterSpacing: "0.12em", marginBottom: 20, fontFamily: "system-ui" }}>
                  {col.title.toUpperCase()}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map(link => {
                    let onClickHandler: ((e: React.MouseEvent) => void) | undefined = (e: React.MouseEvent) => e.preventDefault();
                    let destPage = "#";
                    if (link === "Maldives" || link === "Japon" || link === "Kenya" || link === "Patagonie" || link === "Grèce" || link === "Rajasthan" || col.title === "Destinations") {
                      onClickHandler = (e) => { e.preventDefault(); goTo("destinations"); };
                      destPage = "#destinations";
                    } else if (link === "Voyages sur mesure" || link === "Conciergerie 24h" || link === "Voyages famille" || link === "Lune de miel" || link === "Classe affaires") {
                      onClickHandler = (e) => { e.preventDefault(); goTo("concept"); };
                      destPage = "#concept";
                    } else if (link === "Consultation gratuite" || link === "CGV") {
                      onClickHandler = (e) => { e.preventDefault(); goTo("formules"); };
                      destPage = "#formules";
                    } else if (link === "Mentions légales") {
                      onClickHandler = (e) => { e.preventDefault(); goTo("legal"); };
                      destPage = "#legal";
                    } else if (link.startsWith("+33")) {
                      destPage = "tel:" + link.replace(/\s+/g, "");
                      onClickHandler = undefined;
                    } else if (link.includes("@")) {
                      destPage = "mailto:" + link;
                      onClickHandler = undefined;
                    }
                    return (
                      <li key={link}>
                        <a
                          href={destPage}
                          onClick={onClickHandler}
                          style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "system-ui", transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                        >
                          {link}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "system-ui" }}>© 2024 Évasion Dorée — Tous droits réservés</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={C.accent} color={C.accent} />)}
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", marginLeft: 8 }}>4.97/5 — 1 200+ voyageurs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-PAGE COMPONENTS (FRENCH)
───────────────────────────────────────────── */

function DestinationsPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  const allDestinations = [
    { name: "Maldives Privées", region: "Océan Indien", img: "photo-1514282401047-d79a71a590e8", duration: "10 nuits", price: "À partir de 12 400 €", tag: "Sérénité absolue", desc: "Villas sur pilotis, lagon turquoise privé, plongée de corail — l'archipel d'exception." },
    { name: "Kyoto Impériale", region: "Japon", img: "photo-1528360983277-13d401cdc186", duration: "12 nuits", price: "À partir de 9 800 €", tag: "Patrimoine vivant", desc: "Ryokans historiques, cérémonie du thé privée, géishas et jardins zen au lever du soleil." },
    { name: "Safari Masaï Mara", region: "Kenya", img: "photo-1516426122078-c23e76319801", duration: "9 nuits", price: "À partir de 14 200 €", tag: "Grande migration", desc: "Camp de luxe privé, safaris au lever du soleil, bush dinner sous les étoiles africaines." },
    { name: "Patagonie Sauvage", region: "Argentine & Chili", img: "photo-1501854140801-50d01698950b", duration: "14 nuits", price: "À partir de 8 900 €", tag: "Bout du monde", desc: "Torres del Paine, glaciers Perito Moreno, lodges isolés au cœur d'une nature absolue." },
    { name: "Grèce des Cyclades", region: "Méditerranée", img: "photo-1533105079780-92b9be482077", duration: "8 nuits", price: "À partir de 7 600 €", tag: "Lumière dorée", desc: "Santorin, Mykonos, Folegandros — voilier privatisé et îles secrètes hors des sentiers battus." },
    { name: "Rajasthan Royal", region: "Inde du Nord", img: "photo-1524492412937-b28074a5d7da", duration: "11 nuits", price: "À partir de 6 400 €", tag: "Fastes de l'Orient", desc: "Palace hotels historiques, Jaipur, Udaipur, Jaisalmer — un voyage dans un voyage." },
  ];

  return (
    <section style={{ padding: "140px 40px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>PORTFOLIO EXCLUSIF</span>
            <div style={{ width: 24, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, color: C.marine, lineHeight: 1.1 }}>
            Explorez Nos <em style={{ color: C.accent, fontStyle: "italic" }}>Horizons</em>
          </h1>
          <p style={{ fontSize: 15, color: C.textMuted, fontFamily: "system-ui", maxWidth: 600, margin: "24px auto 0", lineHeight: 1.7 }}>
            Découvrez nos suggestions d'itinéraires haut de gamme entièrement personnalisables par nos créateurs de voyages.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 32 }}>
          {allDestinations.map((dest, i) => (
            <div
              key={i}
              style={{
                borderRadius: 16, overflow: "hidden", background: C.white,
                boxShadow: "0 4px 24px rgba(10,37,64,0.06)",
                border: `1px solid ${C.borderLight}`,
              }}
            >
              <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                <div
                  style={{
                    width: "100%", height: "100%",
                    backgroundImage: `url(https://images.unsplash.com/${dest.img}?w=800&q=85)`,
                    backgroundSize: "cover", backgroundPosition: "center",
                  }}
                />
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{ background: "rgba(201,169,110,0.9)", color: C.marine, fontSize: 10, fontFamily: "system-ui", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 10px", borderRadius: 20 }}>
                    {dest.tag}
                  </span>
                </div>
              </div>
              <div style={{ padding: 32 }}>
                <h3 style={{ fontSize: 24, fontWeight: 400, color: C.marine, marginBottom: 12 }}>{dest.name}</h3>
                <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 24 }}>{dest.desc}</p>
                
                <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 20, marginBottom: 24, display: "flex", justifyContent: "space-between", fontSize: 13, color: C.textMuted, fontFamily: "system-ui" }}>
                  <div><strong>Durée :</strong> {dest.duration}</div>
                  <div><strong>Budget :</strong> {dest.price}</div>
                </div>

                <button
                  onClick={() => goTo("formules")}
                  style={{
                    width: "100%", padding: "14px",
                    background: C.marine, color: C.white,
                    border: "none", borderRadius: 3,
                    fontSize: 12, fontFamily: "system-ui", fontWeight: 700,
                    letterSpacing: "0.1em", cursor: "pointer",
                  }}
                >
                  DEMANDER UN DEVIS PERSONNALISÉ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConceptPage({ goTo }: { goTo: (p: ActivePage) => void }) {
  return (
    <section style={{ padding: "140px 40px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>NOTRE PHILOSOPHIE</span>
            <div style={{ width: 24, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, color: C.marine, lineHeight: 1.1 }}>
            L'Excellence du <em style={{ color: C.accent, fontStyle: "italic" }}>Sur Mesure</em>
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 64, fontSize: 16, color: C.textMuted, fontFamily: "system-ui", lineHeight: 1.8 }}>
          <div style={{ background: C.white, border: `1px solid ${C.borderLight}`, padding: 40, borderRadius: 16 }}>
            <h3 style={{ fontSize: 24, fontWeight: 400, color: C.marine, marginBottom: 16, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Notre Engagement Qualité
            </h3>
            <p>
              Depuis 2006, Évasion Dorée crée des expériences de voyage d'exception pour une clientèle exigeante. Nous ne proposons pas de circuits standardisés. Chaque voyageur se voit attribuer un créateur de voyage dédié qui étudie ses préférences pour façonner un itinéraire sur mesure.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ background: C.white, border: `1px solid ${C.borderLight}`, padding: 32, borderRadius: 16 }}>
              <h4 style={{ fontSize: 18, color: C.marine, marginBottom: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Conciergerie 24h/24</h4>
              <p style={{ fontSize: 14 }}>
                Où que vous soyez dans le monde, un concierge dédié francophone reste à votre entière disposition pour ajuster vos plans, réserver une table de dernière minute ou pallier un imprévu.
              </p>
            </div>
            <div style={{ background: C.white, border: `1px solid ${C.borderLight}`, padding: 32, borderRadius: 16 }}>
              <h4 style={{ fontSize: 18, color: C.marine, marginBottom: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Engagement Éco-responsable</h4>
              <p style={{ fontSize: 14 }}>
                Nous sélectionnons des partenaires hôteliers engagés dans la préservation de l'environnement et de la biodiversité locale. Nous compensons 100% de l'empreinte carbone de vos vols.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => goTo("formules")}
              style={{
                padding: "16px 44px", background: C.accent, color: C.marine,
                border: "none", borderRadius: 3,
                fontSize: 12, fontFamily: "system-ui", fontWeight: 700,
                letterSpacing: "0.12em", cursor: "pointer",
              }}
            >
              COMMENCER MON PROJET DE VOYAGE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormulesPage() {
  return (
    <section style={{ padding: "140px 40px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{ fontSize: 11, color: C.accent, fontFamily: "system-ui", letterSpacing: "0.14em", fontWeight: 600 }}>DEMANDE DE DEVIS</span>
            <div style={{ width: 24, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, color: C.marine, lineHeight: 1.1 }}>
            Formuler Votre <em style={{ color: C.accent, fontStyle: "italic" }}>Projet</em>
          </h1>
          <p style={{ fontSize: 15, color: C.textMuted, fontFamily: "system-ui", marginTop: 20 }}>
            Remplissez notre formulaire de consultation privée. Un conseiller dédié étudiera votre demande sous 4 heures.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ background: C.white, border: `1px solid ${C.borderLight}`, padding: 40, borderRadius: 16, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.marine, fontFamily: "system-ui", marginBottom: 8, letterSpacing: "0.04em" }}>NOM COMPLET</label>
              <input type="text" placeholder="Votre nom" style={{ width: "100%", padding: "12px 16px", border: `1px solid ${C.borderLight}`, borderRadius: 4, fontSize: 14, fontFamily: "system-ui", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.marine, fontFamily: "system-ui", marginBottom: 8, letterSpacing: "0.04em" }}>ADRESSE EMAIL</label>
              <input type="email" placeholder="nom@email.com" style={{ width: "100%", padding: "12px 16px", border: `1px solid ${C.borderLight}`, borderRadius: 4, fontSize: 14, fontFamily: "system-ui", outline: "none" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.marine, fontFamily: "system-ui", marginBottom: 8, letterSpacing: "0.04em" }}>DESTINATION SOUHAITÉE</label>
              <input type="text" placeholder="Ex: Maldives, Japon..." style={{ width: "100%", padding: "12px 16px", border: `1px solid ${C.borderLight}`, borderRadius: 4, fontSize: 14, fontFamily: "system-ui", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.marine, fontFamily: "system-ui", marginBottom: 8, letterSpacing: "0.04em" }}>FORMULE SOUHAITÉE</label>
              <select style={{ width: "100%", padding: "12px 16px", border: `1px solid ${C.borderLight}`, borderRadius: 4, fontSize: 14, fontFamily: "system-ui", outline: "none", color: C.text }}>
                <option value="evasion">Évasion — Le Voyage Essentiel</option>
                <option value="prestige">Prestige — L'Expérience Signature</option>
                <option value="excellence">Excellence — Le Sur-Mesure Absolu</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.marine, fontFamily: "system-ui", marginBottom: 8, letterSpacing: "0.04em" }}>EXIGENCES PARTICULIÈRES</label>
            <textarea rows={4} placeholder="Indiquez ici le nombre de voyageurs, les préférences d'hôtels, activités spécifiques..." style={{ width: "100%", padding: "12px 16px", border: `1px solid ${C.borderLight}`, borderRadius: 4, fontSize: 14, fontFamily: "system-ui", outline: "none", resize: "none" }} />
          </div>

          <button
            type="submit"
            style={{
              padding: "16px", background: C.marine, color: C.white,
              border: "none", borderRadius: 3,
              fontSize: 12, fontFamily: "system-ui", fontWeight: 700,
              letterSpacing: "0.12em", cursor: "pointer",
            }}
          >
            ENVOYER MA DEMANDE DE CONCILIATION
          </button>
        </form>
      </div>
    </section>
  );
}

function LegalPage() {
  return (
    <section style={{ padding: "140px 40px", background: C.bg, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 300, color: C.marine, marginBottom: 40, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Mentions <em style={{ color: C.accent, fontStyle: "italic" }}>Légales</em>
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 36, fontSize: 14, color: C.textMuted, lineHeight: 1.8 }}>
          <div style={{ background: C.white, border: `1px solid ${C.borderLight}`, padding: 32, borderRadius: 12 }}>
            <h3 style={{ fontSize: 18, color: C.marine, marginBottom: 16, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}>
              Édition et Hébergement
            </h3>
            <p>
              <strong>Éditeur :</strong> Aevia WS — Valentin Milliand<br />
              Entrepreneur individuel — SIREN 852 546 225 — RCS Bourg-en-Bresse<br />
              <strong>Contact :</strong> contact@aevia.io<br />
              <strong>Hébergeur :</strong> Vercel Inc., 650 2nd St, San Francisco, CA 94107, USA.<br />
              <strong>Adresse physique :</strong> communiquée sur demande.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 16, color: C.marine, marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Propriété Intellectuelle</h4>
            <p>
              L'intégralité du site Évasion Dorée (textes, images, codes source, structure générale) est protégée par le droit d'auteur. Toute reproduction totale ou partielle sans accord préalable écrit de l'éditeur est strictement interdite.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 16, color: C.marine, marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Protection des Données Personnelles</h4>
            <p>
              Les données personnelles transmises via notre formulaire de contact sont uniquement traitées par Évasion Dorée pour la gestion de votre projet de voyage. Conformément à la réglementation RGPD, vous disposez d'un droit d'accès, de modification et de suppression de vos données sur simple demande par email.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
