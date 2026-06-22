// @ts-nocheck
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  HardHat,
  Building2,
  Truck,
  Wrench,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronDown,
  Award,
  Layers,
  Zap,
  BarChart2,
  FileText,
  Camera,
  MessageSquare,
  Link2,
  Users2,
} from "lucide-react";

const C = {
  bg: "#0E0D0B",
  bgAlt: "#141310",
  bgDeep: "#080706",
  text: "#E8E4DC",
  textMuted: "#6B6560",
  textSub: "#9B9490",
  orange: "#F57C00",
  orangeLight: "#FF9800",
  orangeDark: "#E65100",
  orangeGlow: "rgba(245,124,0,0.15)",
  concrete: "#3D3D3D",
  concreteMid: "#555",
  white: "#FFFFFF",
  border: "#1E1D1A",
  borderOrange: "rgba(245,124,0,0.3)",
};

const FONT_HEADING = "'Oswald', 'Arial Narrow', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const NAV_LINKS = ["Projets", "Métiers", "Équipe", "Références", "Contact"];

const PROJECTS = [
  {
    id: "01",
    name: "Résidence Les Cèdres",
    type: "Logements collectifs",
    category: "residential",
    location: "Grenoble, 38",
    surface: "12 400 m²",
    units: 84,
    budget: "28M€",
    duration: "26 mois",
    progress: 100,
    status: "Livré",
    year: "2024",
    desc: "Programme résidentiel R+8 en béton armé. Isolation thermique RT2020, certification NF Habitat HQE. Livraison 3 semaines avant le délai contractuel.",
  },
  {
    id: "02",
    name: "Campus Tech Sud",
    type: "Bureaux & campus formation",
    category: "commercial",
    location: "Montpellier, 34",
    surface: "8 200 m²",
    units: null,
    budget: "18.5M€",
    duration: "22 mois",
    progress: 73,
    status: "En cours",
    year: "2025",
    desc: "Ensemble tertiaire BBC avec amphithéâtre 400 places, plateaux open-space et espaces collaboratifs. Structure métallique mixte béton.",
  },
  {
    id: "03",
    name: "Centre Commercial Avenir",
    type: "Commerce & loisirs",
    category: "commercial",
    location: "Nantes, 44",
    surface: "22 000 m²",
    units: null,
    budget: "45M€",
    duration: "34 mois",
    progress: 40,
    status: "En chantier",
    year: "2026",
    desc: "Centre commercial deux niveaux avec galerie marchande 120 enseignes, multiplexe 8 salles et parking silo 1 200 places.",
  },
  {
    id: "04",
    name: "Ilôt Vert — Phase 2",
    type: "Réhabilitation & extension",
    category: "renovation",
    location: "Toulouse, 31",
    surface: "4 600 m²",
    units: 32,
    budget: "9.2M€",
    duration: "18 mois",
    progress: 100,
    status: "Livré",
    year: "2023",
    desc: "Réhabilitation lourde de logements sociaux des années 70. Mise aux normes thermiques et accessibilité PMR. Surélévation de deux niveaux.",
  },
  {
    id: "05",
    name: "Pont Industriel de Lyon Est",
    type: "Génie civil",
    category: "commercial",
    location: "Lyon, 69",
    surface: "—",
    units: null,
    budget: "11M€",
    duration: "14 mois",
    progress: 100,
    status: "Livré",
    year: "2023",
    desc: "Pont bipoutre en acier sur voie ferrée, portée 64 m. Mission conception-réalisation pour Réseau Ferré. Travail de nuit et week-end exclusivement.",
  },
  {
    id: "06",
    name: "Lycée Simone Veil",
    type: "Équipement public",
    category: "residential",
    location: "Bordeaux, 33",
    surface: "9 800 m²",
    units: null,
    budget: "22M€",
    duration: "28 mois",
    progress: 58,
    status: "En cours",
    year: "2025",
    desc: "Reconstruction totale du lycée sur site occupé. Phasage en 4 tranches. Structure bois-béton, label E+C-. Marché public régional.",
  },
];

const METIERS = [
  {
    icon: Building2,
    name: "Construction Neuve",
    sub: "Clé en main ou corps d'état séparés",
    desc: "Logements collectifs, bureaux, équipements publics et industriels. De la fondation à la réception, en entreprise générale ou lots séparés selon votre montage.",
    items: ["Béton armé & charpente", "Second œuvre tous lots", "Certification NF Habitat / HQE", "Maîtrise d'œuvre intégrée"],
    from: "Dès 2M€ de travaux",
  },
  {
    icon: Wrench,
    name: "Réhabilitation",
    sub: "Bâti existant, chantier propre",
    desc: "Mise aux normes thermiques et accessibilité, extension, surélévation. Phasage pour maintien en activité. Respect des riverains et des délégations de service.",
    items: ["Diagnostic structure + thermique", "Plan de phasage détaillé", "Coordination CVC & fluides", "Label BBC Rénovation"],
    from: "Dès 500k€ de travaux",
  },
  {
    icon: HardHat,
    name: "Gros Œuvre",
    sub: "Nos équipes internes — zéro sous-traitance non contrôlée",
    desc: "Terrassement, fondations spéciales, béton armé coulé en place, préfabrication, charpente métallique. 12 équipes internes sur l'ensemble du territoire Sud.",
    items: ["Fondations profondes & spéciales", "Voile béton & planchers", "Charpente acier & mixte", "Préfabrication béton"],
    from: "Tous volumes",
  },
  {
    icon: Layers,
    name: "Promotion & AMO",
    sub: "De l'idée à la commercialisation",
    desc: "MOA déléguée, AMO, coordination de programmes immobiliers. Partenariats avec promoteurs, bailleurs sociaux, collectivités et institutionnels.",
    items: ["Montage opérationnel", "Consultation & attribution marchés", "Suivi planning & budget", "Livraison et GPA"],
    from: "Sur mesure",
  },
];

const CORPS_METIERS = [
  "Terrassement & VRD",
  "Fondations spéciales",
  "Béton armé",
  "Charpente bois & acier",
  "Maçonnerie & façade",
  "Isolation thermique",
  "Menuiseries extérieures",
  "CVC & Plomberie",
  "Électricité CFO/CFA",
  "Revêtements sols & murs",
  "Peinture & finitions",
  "Serrurerie & métallerie",
];

const TEAM = [
  {
    name: "Philippe Barrault",
    role: "Directeur Général",
    since: "Fondateur, 1989",
    certs: ["ESTP Paris", "Expert génie civil"],
    desc: "35 ans de chantiers. A supervisé personnellement plus de 120 projets de plus de 10M€.",
  },
  {
    name: "Marie-Ange Delorme",
    role: "Directrice Technique",
    since: "Structure Bâtisseurs depuis 2008",
    certs: ["École Centrale Nantes", "Expert structure béton"],
    desc: "Pilote la cellule études et la coordination des lots techniques sur les grands projets.",
  },
  {
    name: "Julien Cassagne",
    role: "Directeur Travaux",
    since: "Structure Bâtisseurs depuis 2012",
    certs: ["IUT Génie Civil + BDES", "Formateur OPPBTP"],
    desc: "Gère les 12 équipes terrain. Référent qualité et sécurité chantier du groupe.",
  },
  {
    name: "Sophie Anselm",
    role: "Directrice Commerciale",
    since: "Structure Bâtisseurs depuis 2017",
    certs: ["ESTP + MBA ESSEC", "BIM Manager certifié"],
    desc: "Chiffrage, réponse aux appels d'offres, suivi commercial des grands comptes publics et privés.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Livré 3 semaines avant le délai contractuel. 84 logements, zéro malfaçon à la réception. Du jamais-vu sur un chantier de cette envergure.",
    name: "Laurent Duchamp",
    role: "Directeur de programmes",
    company: "Foncière du Sud",
    stars: 5,
  },
  {
    quote: "La coordination intervenants a été exemplaire. Nous avons pu ouvrir le campus aux étudiants dès septembre, conformément à notre calendrier académique.",
    name: "Isabelle Renard",
    role: "Directrice immobilière",
    company: "Campus Tech",
    stars: 5,
  },
  {
    quote: "Prix ferme tenu, interlocuteur unique tout au long du projet. C'est tout ce qu'on demande — et c'est rare dans le BTP.",
    name: "Pierre Moreau",
    role: "DAF",
    company: "Groupe Avenir Retail",
    stars: 5,
  },
  {
    quote: "Leur cellule études a identifié une optimisation de fondation qui nous a économisé 340k€. Le devis initial était déjà compétitif.",
    name: "Véronique Astorg",
    role: "DGA",
    company: "Mairie de Grenoble",
    stars: 5,
  },
  {
    quote: "Sur le pont ferroviaire de Lyon Est, zéro interruption de trafic ferroviaire non planifiée. Une performance technique remarquable.",
    name: "Thierry Boulanger",
    role: "Chef de projet infrastructure",
    company: "SNCF Réseau",
    stars: 5,
  },
  {
    quote: "Chantier propre, riverains non impactés, cahier des charges HSE respecté à 100%. On retravaillera avec eux sur le prochain programme.",
    name: "Alexandra Hue",
    role: "Responsable développement",
    company: "Archipel Habitat",
    stars: 5,
  },
];

const FORMULES = [
  {
    name: "Assistance MOA",
    sub: "AMO & Conseil",
    price: "% du montant travaux",
    note: "sur devis",
    highlight: false,
    features: [
      "Assistance maîtrise d'ouvrage",
      "Montage opérationnel du projet",
      "Sélection et consultation intervenants",
      "Suivi planning & réception",
      "Reporting mensuel MOA",
    ],
    cta: "Demander un devis",
  },
  {
    name: "Entreprise Générale",
    sub: "Mission complète — prix ferme",
    price: "Forfait GD",
    note: "prix ferme & définitif",
    highlight: true,
    features: [
      "Tous corps d'état coordonnés",
      "Interlocuteur unique pour le MOA",
      "Garanties décennale + DO incluses",
      "Planning hebdomadaire partagé",
      "Réunion de chantier systématique",
      "Levée de réserves sous 30 jours",
    ],
    cta: "Obtenir une étude",
  },
  {
    name: "Conception-Réalisation",
    sub: "Design + Build intégré",
    price: "Mission globale",
    note: "sur mesure",
    highlight: false,
    features: [
      "Architecture + construction en one-stop",
      "Optimisation coûts dès la conception",
      "Délai réduit vs procédures classiques",
      "BIM coordination incluse",
      "Référent projet dédié MOA",
    ],
    cta: "En savoir plus",
  },
];

const FAQS = [
  {
    q: "Quel est votre rayon d'intervention géographique ?",
    a: "Principalement le Sud et Centre de la France : Rhône-Alpes, Occitanie, Pays de la Loire, Nouvelle-Aquitaine. Nous étudions tous les projets supérieurs à 10M€ sur l'ensemble du territoire national.",
  },
  {
    q: "Proposez-vous des contrats clé en main avec prix ferme ?",
    a: "Oui — forfait global et définitif (GD), conception-réalisation et contrats en entreprise générale selon la nature du projet. Le prix est ferme dès la signature du marché, sauf modifications demandées par le MOA.",
  },
  {
    q: "Comment gérez-vous les délais et les aléas de chantier ?",
    a: "Planning détaillé niveau 3 partagé dès le lancement. Réunion de chantier hebdomadaire avec compte-rendu sous 24h. Système d'alerte interne sur les écarts de planning supérieurs à 3 jours. Taux de délai tenu : 98%.",
  },
  {
    q: "Vos matériaux sont-ils certifiés et traçables ?",
    a: "100% des fournitures avec certificats CE et fiches techniques FDES. Traçabilité complète disponible sur demande pour chaque lot. Politique zéro matériau sans certification depuis 2015.",
  },
  {
    q: "Intervenez-vous sur les marchés publics ?",
    a: "Oui — références en marchés publics disponibles sur demande. Habilitations à jour, attestations fiscales et sociales fournies, KBIS récent communiqué à la consultation. Expérience marchés MAPA et appel d'offres ouvert.",
  },
  {
    q: "Quelle est votre politique HSE sur les chantiers ?",
    a: "Plan de prévention et PPSPS rédigés avant toute intervention. Formation HSE obligatoire pour toutes les équipes internes. Taux de fréquence d'accidents : 2.1 (indice national BTP : 26). Chantiers propres certifiés OPPBTP.",
  },
];

const PARTENAIRES = [
  "Bouygues Immobilier", "Vinci Construction", "Foncière du Sud", "SNCF Réseau",
  "Ville de Grenoble", "Région Occitanie", "Archipel Habitat", "BNP Paribas REIM",
];

function CountUp({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString("fr-FR")}{suffix}</span>;
}

export default function Impact173Page() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", project: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const statsRef = useRef(null);
  const metiersRef = useRef(null);
  const teamRef = useRef(null);
  const testimonialsRef = useRef(null);
  const formulesRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const metiersInView = useInView(metiersRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });
  const formulesInView = useInView(formulesRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const unsub = scrollY.on("change", v => setNavScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  const filteredProjects = activeFilter === "all"
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  const FILTERS = [
    { id: "all", label: "Tous les projets" },
    { id: "residential", label: "Résidentiel" },
    { id: "commercial", label: "Tertiaire & Commercial" },
    { id: "renovation", label: "Réhabilitation" },
  ];

  const STATS_DATA = [
    { target: 340, suffix: "+", label: "Projets livrés", sub: "depuis 1989" },
    { target: 98, suffix: "%", label: "Délais tenus", sub: "contractuellement" },
    { target: 35, suffix: " ans", label: "D'expertise", sub: "fondé en 1989" },
    { target: 2400, suffix: "M€", label: "Volume construit", sub: "cumulé groupe" },
  ];

  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: FONT_BODY, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.orange}; color: #fff; }
        input, textarea, select { font-family: inherit; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navScrolled ? "rgba(14,13,11,0.97)" : "transparent",
          borderBottom: navScrolled ? `1px solid ${C.border}` : "1px solid transparent",
          backdropFilter: navScrolled ? "blur(12px)" : "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 60px", height: 72,
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 38, height: 38, background: C.orange,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 18, color: "#fff",
            letterSpacing: 1,
          }}>SB</div>
          <div style={{ fontFamily: FONT_HEADING, fontWeight: 600, fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: C.text }}>
            Structure Bâtisseurs
          </div>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#hero"
              style={{ fontSize: 12, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >{link}</a>
          ))}
          <motion.button
            whileHover={{ background: C.orangeLight, color: "#fff" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "10px 28px", background: C.orange, color: "#fff",
              border: "none", fontFamily: FONT_HEADING, fontWeight: 600,
              fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >Devis →</motion.button>
        </div>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section id="hero" ref={heroRef} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Diagonal orange panel — signature element */}
        <motion.div style={{
          position: "absolute", top: 0, right: 0,
          width: "44%", height: "100%",
          background: `linear-gradient(160deg, ${C.orange} 0%, ${C.orangeDark} 100%)`,
          clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
          zIndex: 0,
          y: heroY,
        }} />

        {/* Construction site texture overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(245,124,0,0.02) 40px, rgba(245,124,0,0.02) 41px)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 2, padding: "120px 60px 80px", width: "100%", maxWidth: 1400, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}
            >
              <div style={{ width: 40, height: 2, background: C.orange }} />
              <div style={{ fontSize: 11, letterSpacing: 5, color: C.orange, textTransform: "uppercase", fontWeight: 600 }}>
                Depuis 1989 · Construire l'avenir
              </div>
            </motion.div>

            <h1 style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(72px, 11vw, 160px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: C.text,
              marginBottom: 0,
            }}>
              ON<br />
              <span style={{ WebkitTextStroke: `2px ${C.orange}`, WebkitTextFillColor: "transparent", color: "transparent" }}>
                BÂTIT.
              </span>
            </h1>
            <div style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(72px, 11vw, 160px)",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: C.concrete,
              marginBottom: 0,
            }}>SOLIDE.</div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ maxWidth: 520, fontSize: 16, color: C.textSub, lineHeight: 1.8, marginTop: 48, marginBottom: 56 }}
            >
              Entreprise générale de construction depuis 35 ans. Gros œuvre, réhabilitation, promotion immobilière. Prix ferme, délais tenus, interlocuteur unique.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
            >
              <motion.button
                whileHover={{ background: C.orangeLight, transform: "translateY(-2px)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "18px 48px", background: C.orange, color: "#fff",
                  border: "none", fontFamily: FONT_HEADING, fontWeight: 600,
                  fontSize: 14, letterSpacing: 2, textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.25s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                Voir nos chantiers <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ borderColor: C.text, color: C.text }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "18px 48px", background: "transparent",
                  color: C.textMuted, border: `2px solid ${C.border}`,
                  fontFamily: FONT_HEADING, fontWeight: 600,
                  fontSize: 14, letterSpacing: 2, textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.25s",
                }}
              >
                Demander un devis
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating stats badges */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{
              position: "absolute", right: 80, bottom: 120,
              display: "flex", flexDirection: "column", gap: 16,
            }}
          >
            {[
              { val: "340+", label: "Projets" },
              { val: "98%", label: "Délais tenus" },
              { val: "35 ans", label: "Expérience" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.15 }}
                style={{
                  background: "rgba(14,13,11,0.85)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${C.border}`,
                  padding: "16px 24px",
                  borderLeft: `3px solid ${C.orange}`,
                }}
              >
                <div style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.orange, letterSpacing: -1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ position: "absolute", bottom: 40, left: "50%", x: "-50%", opacity: heroOpacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} color={C.orange} />
        </motion.div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section ref={statsRef} style={{ background: C.orange, position: "relative", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        }}>
          {STATS_DATA.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: "72px 48px", textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.2)" : undefined,
              }}
            >
              <div style={{ fontFamily: FONT_HEADING, fontSize: "clamp(42px, 5vw, 72px)", fontWeight: 700, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>
                {statsInView ? <CountUp target={s.target} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROJETS GALLERY ─────────────────────────────────────── */}
      <section style={{ padding: "120px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Réalisations</div>
              <h2 style={{
                fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)",
                fontWeight: 700, letterSpacing: -2, textTransform: "uppercase", lineHeight: 0.95,
              }}>
                NOS<br />CHANTIERS
              </h2>
            </div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <motion.button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "10px 20px",
                    background: activeFilter === f.id ? C.orange : "transparent",
                    color: activeFilter === f.id ? "#fff" : C.textMuted,
                    border: `1px solid ${activeFilter === f.id ? C.orange : C.border}`,
                    fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.2s", fontFamily: FONT_BODY,
                  }}
                >{f.label}</motion.button>
              ))}
            </div>
          </div>

          <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ zIndex: 2 }}
                  style={{ position: "relative", background: C.bgAlt, border: `1px solid ${C.border}`, cursor: "pointer", overflow: "hidden", group: "card" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.orange;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  }}
                >
                  {/* Fake image zone */}
                  <div style={{
                    height: 200, background: `linear-gradient(135deg, ${C.concrete} 0%, #222 100%)`,
                    position: "relative", overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Building2 size={48} color="rgba(245,124,0,0.3)" />
                    <div style={{
                      position: "absolute", top: 16, left: 16,
                      background: p.status === "Livré" ? "rgba(0,0,0,0.6)" : C.orange,
                      color: "#fff", fontSize: 10, letterSpacing: 2,
                      textTransform: "uppercase", padding: "4px 12px", fontWeight: 600,
                    }}>{p.status} {p.year}</div>
                    <div style={{
                      position: "absolute", top: 16, right: 16,
                      background: "rgba(0,0,0,0.6)", color: C.orange,
                      fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                      padding: "4px 12px", fontWeight: 600,
                    }}>#{p.id}</div>
                  </div>

                  <div style={{ padding: "28px 32px" }}>
                    <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{p.type} · {p.location}</div>
                    <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 600, color: C.text, letterSpacing: -0.5, marginBottom: 12 }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>

                    <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
                      {[
                        { label: "Surface", val: p.surface },
                        { label: "Budget", val: p.budget },
                        { label: "Durée", val: p.duration },
                      ].map(m => (
                        <div key={m.label}>
                          <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{m.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background: p.progress === 100 ? C.concreteMid : C.orange,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <div style={{ fontSize: 10, color: C.textMuted }}>Avancement</div>
                      <div style={{ fontSize: 10, color: p.progress === 100 ? C.textMuted : C.orange, fontWeight: 600 }}>{p.progress}%</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <motion.button
              whileHover={{ background: C.orange, color: "#fff", borderColor: C.orange }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "16px 48px", background: "transparent", color: C.orange,
                border: `2px solid ${C.orange}`, fontFamily: FONT_HEADING,
                fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.25s",
              }}
            >Voir tous nos chantiers →</motion.button>
          </div>
        </div>
      </section>

      {/* ── CORPS DE MÉTIERS ────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, padding: "120px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Savoir-faire</div>
              <h2 style={{
                fontFamily: FONT_HEADING, fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700, letterSpacing: -1, textTransform: "uppercase", lineHeight: 1, marginBottom: 32,
              }}>CORPS DE<br />MÉTIERS</h2>
              <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.9, marginBottom: 48, maxWidth: 440 }}>
                Nos équipes internes couvrent l'intégralité des corps d'état. Zéro sous-traitance non maîtrisée — chaque intervenant est qualifié, formé, et coordonné par nos chefs de chantier.
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 700, color: C.orange }}>12</div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Équipes terrain</div>
                </div>
                <div style={{ width: 1, background: C.border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 700, color: C.orange }}>280+</div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Collaborateurs</div>
                </div>
                <div style={{ width: 1, background: C.border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 700, color: C.orange }}>100%</div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Qualifiés RGE</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {CORPS_METIERS.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    padding: "16px 20px",
                    borderBottom: `1px solid ${C.border}`,
                    borderRight: i % 2 === 0 ? `1px solid ${C.border}` : undefined,
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bgDeep; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 6, height: 6, background: C.orange, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: C.textSub, fontWeight: 500 }}>{m}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES / MÉTIERS ──────────────────────────────────── */}
      <section ref={metiersRef} style={{ padding: "120px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Nos missions</div>
          <h2 style={{
            fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 700, letterSpacing: -2, textTransform: "uppercase", lineHeight: 0.95, marginBottom: 72,
          }}>NOS MÉTIERS</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {METIERS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={metiersInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  style={{
                    border: `1px solid ${C.border}`, padding: "48px 36px",
                    cursor: "pointer", transition: "all 0.25s", background: C.bgAlt,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.orange;
                    (e.currentTarget as HTMLElement).style.background = "#1a1915";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLElement).style.background = C.bgAlt;
                  }}
                >
                  <div style={{
                    width: 52, height: 52, background: C.orangeGlow,
                    border: `1px solid ${C.borderOrange}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 28,
                  }}>
                    <Icon size={24} color={C.orange} />
                  </div>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 600, color: C.text, letterSpacing: -0.3, marginBottom: 6 }}>{s.name}</h3>
                  <div style={{ fontSize: 11, color: C.orange, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>{s.sub}</div>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>{s.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {s.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 4, height: 4, background: C.orange, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: C.textSub }}>{item}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: C.orange, fontWeight: 600, letterSpacing: 1 }}>{s.from}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────── */}
      <section ref={teamRef} style={{ background: C.bgAlt, padding: "120px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Direction</div>
              <h2 style={{
                fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)",
                fontWeight: 700, letterSpacing: -2, textTransform: "uppercase", lineHeight: 0.95,
              }}>L'ÉQUIPE<br />DIRIGEANTE</h2>
            </div>
            <p style={{ maxWidth: 380, fontSize: 15, color: C.textSub, lineHeight: 1.9 }}>
              Des ingénieurs et managers formés sur le terrain. Chaque décision de chantier est prise par des techniciens qui connaissent le béton, le bois et l'acier.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {TEAM.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                style={{
                  border: `1px solid ${C.border}`, padding: "40px 32px",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{
                  width: 64, height: 64, background: C.concrete,
                  marginBottom: 24, position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 22, color: "#fff",
                }}>
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: C.orange, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>{m.role}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16 }}>{m.since}</div>
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>{m.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {m.certs.map((c, j) => (
                    <div key={j} style={{ fontSize: 11, color: C.textMuted, display: "flex", gap: 6, alignItems: "center" }}>
                      <Award size={10} color={C.orange} /> {c}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section ref={testimonialsRef} style={{ padding: "120px 60px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Références clients</div>
          <h2 style={{
            fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 700, letterSpacing: -2, textTransform: "uppercase",
            lineHeight: 0.95, marginBottom: 72,
          }}>
            ILS NOUS FONT<br />CONFIANCE
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{
                  borderTop: `3px solid ${C.orange}`, paddingTop: 32,
                  paddingRight: 8,
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} color={C.orange} fill={C.orange} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>
                  « {t.quote} »
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, background: C.concrete,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: FONT_HEADING,
                    flexShrink: 0,
                  }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULES / PRICING ──────────────────────────────────── */}
      <section ref={formulesRef} style={{ padding: "120px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Nos formules</div>
            <h2 style={{
              fontFamily: FONT_HEADING, fontSize: "clamp(40px, 6vw, 80px)",
              fontWeight: 700, letterSpacing: -2, textTransform: "uppercase", lineHeight: 0.95,
            }}>COMMENT TRAVAILLER<br />AVEC NOUS</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {FORMULES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                animate={formulesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{
                  background: f.highlight ? "#1A1710" : C.bgAlt,
                  border: `2px solid ${f.highlight ? C.orange : C.border}`,
                  padding: "52px 44px", position: "relative",
                }}
              >
                {f.highlight && (
                  <div style={{
                    position: "absolute", top: -1, left: 0, right: 0, height: 4,
                    background: `linear-gradient(90deg, ${C.orange}, ${C.orangeLight})`,
                  }} />
                )}
                {f.highlight && (
                  <div style={{
                    position: "absolute", top: 24, right: 24,
                    background: C.orange, color: "#fff",
                    fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                    padding: "4px 12px", fontWeight: 700,
                  }}>Recommandé</div>
                )}

                <div style={{ fontSize: 11, color: f.highlight ? C.orange : C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>{f.name}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>{f.sub}</div>
                <div style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: -1, lineHeight: 1.1, marginBottom: 4 }}>{f.price}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 40 }}>{f.note}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
                  {f.features.map((feat, j) => (
                    <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <CheckCircle size={14} color={C.orange} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: f.highlight ? C.textSub : C.textMuted, lineHeight: 1.5 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ background: C.orange, color: "#fff", borderColor: C.orange }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "16px",
                    background: f.highlight ? C.orange : "transparent",
                    color: f.highlight ? "#fff" : C.orange,
                    border: `2px solid ${f.highlight ? C.orange : C.border}`,
                    fontFamily: FONT_HEADING, fontWeight: 600,
                    fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >{f.cta}</motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 60px", background: C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>Questions fréquentes</div>
          <h2 style={{
            fontFamily: FONT_HEADING, fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700, letterSpacing: -1, textTransform: "uppercase", marginBottom: 64,
          }}>FAQ</h2>

          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "24px 0",
                  background: "none", border: "none", color: C.text,
                  cursor: "pointer", textAlign: "left", fontFamily: FONT_BODY,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, maxWidth: "85%" }}>{f.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  style={{ fontSize: 28, color: C.orange, minWidth: 28, lineHeight: 1 }}
                >+</motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ paddingBottom: 28, fontSize: 14, color: C.textMuted, lineHeight: 1.9 }}>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTENAIRES ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 60px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase", textAlign: "center", marginBottom: 40 }}>Ils nous font confiance</div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
            {PARTENAIRES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  padding: "20px 40px", borderRight: `1px solid ${C.border}`,
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 13, color: C.textMuted, fontWeight: 600,
                  letterSpacing: 1, textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
              >{p}</motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVIS FORM / CTA ────────────────────────────────────── */}
      <section id="contact" style={{ background: C.orange, padding: "120px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 20 }}>Devis gratuit · Réponse sous 48h</div>
            <h2 style={{
              fontFamily: FONT_HEADING, fontSize: "clamp(44px, 7vw, 96px)",
              fontWeight: 700, letterSpacing: -3, textTransform: "uppercase",
              color: "#fff", lineHeight: 0.9, marginBottom: 36,
            }}>
              VOTRE PROJET,<br />NOTRE<br />CHANTIER.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.9, maxWidth: 400 }}>
              Envoyez-nous vos plans, cahier des charges, ou juste quelques lignes sur votre projet. Nous revenons vers vous avec une approche et une première estimation.
            </p>
            <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: Phone, text: "+33 4 76 XX XX XX" },
                { icon: Mail, text: "contact@structure-batisseurs.fr" },
                { icon: MapPin, text: "Grenoble · Montpellier · Nantes" },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <Icon size={16} color="rgba(255,255,255,0.7)" />
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>{c.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  { key: "name", placeholder: "Votre nom / Société", type: "text" },
                  { key: "email", placeholder: "Email professionnel", type: "email" },
                  { key: "phone", placeholder: "Téléphone", type: "tel" },
                ].map(field => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      padding: "16px 20px", background: "rgba(255,255,255,0.15)",
                      border: "2px solid rgba(255,255,255,0.3)", color: "#fff",
                      fontSize: 14, outline: "none", fontFamily: FONT_BODY,
                    }}
                  />
                ))}
                <select
                  value={formData.project}
                  onChange={e => setFormData(prev => ({ ...prev, project: e.target.value }))}
                  style={{
                    padding: "16px 20px", background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.3)", color: "#fff",
                    fontSize: 14, outline: "none", fontFamily: FONT_BODY, cursor: "pointer",
                  }}
                >
                  <option value="" style={{ background: C.orangeDark }}>Type de projet</option>
                  <option value="logements" style={{ background: C.orangeDark }}>Logements collectifs</option>
                  <option value="bureaux" style={{ background: C.orangeDark }}>Bureaux & tertiaire</option>
                  <option value="rehabilitation" style={{ background: C.orangeDark }}>Réhabilitation</option>
                  <option value="equip" style={{ background: C.orangeDark }}>Équipement public</option>
                  <option value="industrie" style={{ background: C.orangeDark }}>Industriel</option>
                </select>
                <select
                  value={formData.budget}
                  onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  style={{
                    padding: "16px 20px", background: "rgba(255,255,255,0.15)",
                    border: "2px solid rgba(255,255,255,0.3)", color: "#fff",
                    fontSize: 14, outline: "none", fontFamily: FONT_BODY, cursor: "pointer",
                  }}
                >
                  <option value="" style={{ background: C.orangeDark }}>Budget estimé</option>
                  <option value="500k-2m" style={{ background: C.orangeDark }}>500k€ — 2M€</option>
                  <option value="2m-10m" style={{ background: C.orangeDark }}>2M€ — 10M€</option>
                  <option value="10m-30m" style={{ background: C.orangeDark }}>10M€ — 30M€</option>
                  <option value="30m+" style={{ background: C.orangeDark }}>30M€+</option>
                </select>
                <motion.button
                  type="submit"
                  whileHover={{ background: C.bg, color: C.orange }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "20px", background: "#fff", color: C.orangeDark,
                    border: "none", fontFamily: FONT_HEADING, fontWeight: 700,
                    fontSize: 15, letterSpacing: 2, textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.25s", marginTop: 4,
                  }}
                >Envoyer ma demande →</motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)",
                  padding: "60px 40px", textAlign: "center",
                }}
              >
                <CheckCircle size={48} color="#fff" style={{ marginBottom: 24 }} />
                <div style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: -1, marginBottom: 12 }}>Demande envoyée !</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>Notre équipe technique vous contacte dans les 48h avec une première approche de votre projet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{ background: C.bgDeep, padding: "64px 60px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, background: C.orange,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 15, color: "#fff",
                }}>SB</div>
                <div style={{ fontFamily: FONT_HEADING, fontWeight: 600, fontSize: 15, letterSpacing: 2, textTransform: "uppercase" }}>Structure Bâtisseurs</div>
              </div>
              <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, maxWidth: 300 }}>
                Entreprise générale de construction fondée en 1989. 280 collaborateurs, 12 équipes terrain, 340+ projets livrés.
              </p>
            </div>
            {[
              { title: "Missions", links: ["Construction Neuve", "Réhabilitation", "Gros Œuvre", "Promotion & AMO"] },
              { title: "Projets", links: ["Résidentiel", "Tertiaire", "Équipements publics", "Génie civil"] },
              { title: "Contact", links: ["Grenoble (siège)", "Montpellier", "Nantes", "contact@structure-batisseurs.fr"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11, color: C.orange, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(link => (
                    <a key={link} href="#contact" style={{ fontSize: 13, color: C.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                    >{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontSize: 12, color: C.textMuted }}>© 2025 Structure Bâtisseurs · Tous droits réservés · Grenoble, France</div>
            <div style={{ display: "flex", gap: 32 }}>
              {["Mentions légales", "RGPD", "Politique cookies"].map(l => (
                <a key={l} href="#contact" style={{ fontSize: 12, color: C.textMuted, textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
