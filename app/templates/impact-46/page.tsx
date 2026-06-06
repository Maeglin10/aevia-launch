"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import {
  Mail, MapPin, Clock, Star, ChevronDown,
  ArrowRight, Check, Scale, BookOpen, Briefcase, Shield,
  Users, Award, FileText, MessageSquare, ChevronRight
} from "lucide-react";

const C = {
  bg: "#f7f8fa",
  bgDark: "#0a1628",
  bgCard: "#ffffff",
  bgGold: "rgba(184,149,42,0.08)",
  text: "#0a1628",
  textLight: "#ffffff",
  textMuted: "#5a6478",
  textDim: "#9aa3b2",
  accent: "#b8952a",
  accentHover: "#d4aa30",
  accentLight: "rgba(184,149,42,0.12)",
  navy: "#0a1628",
  navyLight: "#142238",
  border: "rgba(10,22,40,0.08)",
  borderDark: "rgba(255,255,255,0.1)",
  borderGold: "rgba(184,149,42,0.3)",
  white: "#ffffff",
};

const practiceAreas = [
  { icon: Briefcase, title: "Corporate Law", desc: "Entity formation, governance, shareholder agreements, and ongoing corporate counsel for businesses at every stage." },
  { icon: Scale, title: "Mergers & Acquisitions", desc: "Buy-side and sell-side M&A, due diligence, deal structuring, and post-merger integration support." },
  { icon: Shield, title: "Intellectual Property", desc: "Patent strategy, trademark registration, licensing, and IP portfolio management for technology and creative enterprises." },
  { icon: BookOpen, title: "Commercial Litigation", desc: "Business disputes, contract enforcement, shareholder conflicts, and complex commercial arbitration." },
  { icon: Users, title: "Employment Law", desc: "Employment contracts, executive compensation, non-compete agreements, and workplace compliance programs." },
  { icon: FileText, title: "Tax & Structuring", desc: "Corporate tax planning, transaction structuring, international tax strategy, and regulatory compliance." },
];

const attorneys = [
  {
    name: "Édouard Dumont",
    title: "Founding Partner",
    bar: "Paris Bar, 1998",
    education: "Sciences Po Paris, Harvard Law LLM",
    focus: "M&A, Corporate Governance",
    bio: "Édouard founded the firm after 12 years at a Magic Circle firm. He has led over 140 M&A transactions across France, Germany, and the United States, with aggregate deal values exceeding €4.2 billion.",
    matters: "140+ transactions",
    value: "€4.2B+",
    languages: "French, English, German",
  },
  {
    name: "Claire Vernet",
    title: "Partner",
    bar: "Paris Bar, 2004",
    education: "Université Paris I, NYU School of Law LLM",
    focus: "Intellectual Property, Technology",
    bio: "Claire leads the firm's IP and technology practice. She has represented leading French tech companies, media groups, and multinational corporations in patent disputes, licensing negotiations, and technology acquisitions.",
    matters: "80+ IP mandates",
    value: "€800M+",
    languages: "French, English",
  },
  {
    name: "Marc-Antoine Lebrun",
    title: "Partner",
    bar: "Paris Bar, 2007",
    education: "Université Paris II, Columbia Law LLM",
    focus: "Commercial Litigation, Arbitration",
    bio: "Marc-Antoine is one of Paris's leading commercial litigators, with an exceptional record in ICC arbitration and French commercial court proceedings. He handles the firm's most complex adversarial matters.",
    matters: "200+ cases",
    value: "€1.1B+",
    languages: "French, English, Spanish",
  },
];

const caseResults = [
  { value: "€4.2B+", label: "M&A Deal Value Advised" },
  { value: "97%", label: "Favorable Outcomes" },
  { value: "28", label: "Years in Practice" },
  { value: "340+", label: "Corporate Clients" },
];

const testimonials = [
  {
    name: "Jean-Baptiste Moreau",
    title: "CEO, Lumière Technologies",
    rating: 5,
    text: "Dumont & Associates guided us through a complex €220M acquisition in under three months. Their M&A team anticipated every issue before it became a problem. Exceptional.",
    matter: "Cross-border Acquisition",
  },
  {
    name: "Sophie Andreani",
    title: "General Counsel, Meridian Group",
    rating: 5,
    text: "Claire Vernet's IP work for us has been transformative. She rebuilt our entire patent strategy, negotiated three major licensing deals, and helped us avoid a catastrophic dispute. Outstanding.",
    matter: "IP Strategy & Licensing",
  },
  {
    name: "François-Xavier Blanchard",
    title: "Founder, Atelier Capital",
    rating: 5,
    text: "When we needed litigation counsel in an urgent shareholder dispute, Marc-Antoine had a strategy within 48 hours. We prevailed completely. I trust this firm with everything.",
    matter: "Shareholder Litigation",
  },
];

const consultationTiers = [
  {
    name: "Initial Consultation",
    price: "Free",
    duration: "45 min",
    desc: "A complimentary introductory meeting to understand your matter and assess how we can assist you.",
    includes: ["Matter overview", "Team introduction", "Preliminary assessment", "Fee structure discussion"],
    cta: "Schedule Free Meeting",
    featured: false,
  },
  {
    name: "Standard Mandate",
    price: "€450/hr",
    duration: "Hourly",
    desc: "Full legal counsel on defined matters — corporate, IP, employment, litigation, and advisory work.",
    includes: ["Dedicated partner", "Associate support team", "Document review", "Regular reporting", "Strategic advice"],
    cta: "Engage Counsel",
    featured: false,
  },
  {
    name: "General Counsel Retainer",
    price: "€8,500/mo",
    duration: "Monthly",
    desc: "Embedded legal partnership for businesses that need ongoing sophisticated counsel without building an in-house team.",
    includes: ["Unlimited consultations", "Designated partner", "Proactive legal review", "Contract review SLA 48h", "Board-level advisory", "Priority access"],
    cta: "Start Retainer",
    featured: true,
  },
];

const faqs = [
  {
    q: "Is our conversation confidential from the first contact?",
    a: "Yes. Attorney-client privilege attaches from your first substantive communication with our firm, even prior to a formal engagement. Everything you share is fully protected.",
  },
  {
    q: "How are your fees structured?",
    a: "We offer hourly billing, fixed fees for defined projects, and monthly retainer arrangements. We provide transparent fee estimates before beginning any matter and invoice monthly with detailed breakdowns.",
  },
  {
    q: "Do you represent individuals or only corporations?",
    a: "Our primary focus is business law — corporations, private equity, founders, and executive-level individuals on commercial matters. We do not practice criminal law or family law.",
  },
  {
    q: "What is your typical response time?",
    a: "We commit to responding to all client communications within 24 business hours. Retainer clients have direct mobile access to their partner and can expect same-day responses for urgent matters.",
  },
  {
    q: "Do you work on international matters?",
    a: "Yes. We advise on cross-border transactions, international arbitration, and EU regulatory matters. We maintain a network of correspondent firms in 22 countries for local counsel when required.",
  },
  {
    q: "How do I get started?",
    a: "Contact us by phone, email, or the contact form below to schedule a complimentary 45-minute consultation. We will assess your matter, identify the right team, and propose an engagement structure.",
  },
];

// ─── Multi-page navigation config ───────────────────────────────────────────
// PATTERN (reused identically across all impact themes): a single `page` state
// drives in-page navigation. The existing single-page content is rendered
// verbatim under page === "home"; every other key renders a theme-native
// sub-page built from the same `C` design tokens, fonts (Playfair Display +
// Source Sans Pro) and section styling. Vitrine-specific tweak vs the e-commerce
// reference (impact-168): nav pages are Accueil/Services/Blog/À propos/Contact
// + legal (Mentions légales / Confidentialité) instead of Boutique/CGV, and
// there is no cart/product-detail state to thread through.
type LawPage = "home" | "services" | "blog" | "about" | "contact" | "mentions" | "privacy";

const NAV_PAGES: { key: LawPage; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "services", label: "Services" },
  { key: "blog", label: "Blog" },
  { key: "about", label: "À propos" },
  { key: "contact", label: "Contact" },
  { key: "mentions", label: "Mentions légales" },
];

// ─── Detailed practice-area / service descriptions (Services sub-page) ─────────
const serviceDetails = [
  {
    icon: Briefcase,
    title: "Droit des sociétés",
    desc: "Constitution d'entité, gouvernance, pactes d'associés et conseil corporate continu pour les entreprises à chaque étape de leur développement.",
    points: ["Création et structuration de sociétés", "Pactes d'associés et d'actionnaires", "Gouvernance et secrétariat juridique", "Opérations sur le capital"],
  },
  {
    icon: Scale,
    title: "Fusions & acquisitions",
    desc: "Opérations buy-side et sell-side, due diligence, structuration des deals et accompagnement post-acquisition.",
    points: ["Audits d'acquisition (due diligence)", "Négociation et rédaction des actes", "Structuration fiscale du deal", "Intégration post-acquisition"],
  },
  {
    icon: Shield,
    title: "Propriété intellectuelle",
    desc: "Stratégie de brevets, dépôt de marques, licences et gestion de portefeuille PI pour les entreprises technologiques et créatives.",
    points: ["Dépôt et défense de marques", "Stratégie et portefeuille de brevets", "Contrats de licence et de cession", "Contentieux PI et contrefaçon"],
  },
  {
    icon: BookOpen,
    title: "Contentieux commercial",
    desc: "Litiges d'affaires, exécution de contrats, conflits entre associés et arbitrage commercial complexe.",
    points: ["Contentieux contractuel", "Conflits entre associés", "Arbitrage commercial (CCI)", "Procédures devant le Tribunal de commerce"],
  },
  {
    icon: Users,
    title: "Droit social",
    desc: "Contrats de travail, rémunération des dirigeants, clauses de non-concurrence et programmes de conformité.",
    points: ["Contrats de travail et de dirigeants", "Clauses de non-concurrence", "Ruptures et transactions", "Conformité et audits sociaux"],
  },
  {
    icon: FileText,
    title: "Fiscalité & structuration",
    desc: "Planification fiscale des entreprises, structuration d'opérations, stratégie fiscale internationale et conformité réglementaire.",
    points: ["Optimisation fiscale légale", "Structuration de groupes", "Fiscalité internationale", "Conformité et rescrits"],
  },
];

const firmValues = [
  { icon: Award, title: "Excellence", text: "Vingt-huit années d'exercice au plus haut niveau du droit des affaires parisien, au service d'exigences sans compromis." },
  { icon: Shield, title: "Discrétion", text: "Le secret professionnel et la confidentialité guident chacune de nos interventions, dès le premier échange." },
  { icon: Scale, title: "Résultats", text: "97 % d'issues favorables. Nous ne mesurons notre réussite qu'à l'aune de celle de nos clients." },
];

// ─── Blog mock data (FR legal insights) ───────────────────────────────────────
const blogPosts = [
  {
    slug: "pacte-associes",
    title: "Pacte d'associés : les clauses qui protègent vraiment",
    date: "4 juin 2026",
    category: "Droit des sociétés",
    excerpt:
      "Au-delà des statuts, le pacte d'associés est l'outil clé pour anticiper les conflits. Tour d'horizon des clauses essentielles à ne pas négliger.",
    cover: "#b8952a",
    body: [
      "Le pacte d'associés est un contrat extra-statutaire qui organise les relations entre associés au-delà de ce que prévoient les statuts. Sa confidentialité et sa souplesse en font l'instrument privilégié pour anticiper les situations de blocage.",
      "Trois familles de clauses méritent une attention particulière. Les clauses de sortie d'abord — droit de préemption, clauses de drag-along et tag-along — encadrent la cession des titres et protègent tant les majoritaires que les minoritaires lors d'une opération de cession.",
      "Les clauses de gouvernance ensuite, qui répartissent le pouvoir décisionnel et prévoient des majorités renforcées pour les décisions stratégiques. Enfin, les clauses de règlement des différends, qui doivent privilégier des mécanismes de médiation avant toute action judiciaire.",
      "Un pacte bien rédigé est un pacte qui n'aura jamais à être invoqué : sa vertu première est dissuasive. Nous recommandons une revue tous les trois ans pour l'adapter à l'évolution de l'entreprise.",
    ],
  },
  {
    slug: "due-diligence",
    title: "Due diligence : anticiper les risques avant l'acquisition",
    date: "21 mai 2026",
    category: "Fusions & acquisitions",
    excerpt:
      "Une due diligence rigoureuse fait la différence entre une acquisition réussie et un contentieux post-deal. Notre méthodologie en quatre volets.",
    cover: "#142238",
    body: [
      "La due diligence est l'audit d'acquisition qui précède toute opération de M&A. Son objectif : identifier les risques juridiques, financiers et fiscaux susceptibles d'affecter la valeur de la cible ou d'engager la responsabilité de l'acquéreur.",
      "Nous structurons nos audits autour de quatre volets : corporate (titres, gouvernance, autorisations), contractuel (engagements significatifs, clauses de changement de contrôle), social (contentieux, engagements de retraite) et propriété intellectuelle (titularité des actifs immatériels).",
      "Les conclusions de l'audit alimentent directement la négociation : ajustement de prix, garanties d'actif et de passif, conditions suspensives. Une faiblesse identifiée tôt est une faiblesse maîtrisée.",
      "L'erreur la plus coûteuse consiste à compresser le calendrier d'audit pour accélérer un closing. Le temps gagné se paie toujours, et souvent au centuple, en contentieux post-acquisition.",
    ],
  },
  {
    slug: "non-concurrence",
    title: "Clause de non-concurrence : validité et contreparties",
    date: "9 mai 2026",
    category: "Droit social",
    excerpt:
      "Une clause de non-concurrence sans contrepartie financière est nulle. Rappel des conditions cumulatives de validité posées par la jurisprudence.",
    cover: "#0a1628",
    body: [
      "La clause de non-concurrence restreint la liberté du salarié de retrouver un emploi après la rupture de son contrat. Sa validité est subordonnée à des conditions cumulatives strictes, dégagées par la Cour de cassation.",
      "La clause doit être indispensable à la protection des intérêts légitimes de l'entreprise, limitée dans le temps et dans l'espace, tenir compte des spécificités de l'emploi du salarié et — condition essentielle — comporter une contrepartie financière.",
      "L'absence de contrepartie financière entraîne la nullité de la clause, et le salarié peut prétendre à des dommages-intérêts s'il en a respecté les termes. Une contrepartie dérisoire est assimilée à une absence de contrepartie.",
      "Nous conseillons aux employeurs de prévoir une faculté de renonciation expresse, à exercer dans un délai défini après la rupture, afin d'éviter le versement d'une contrepartie devenue sans objet.",
    ],
  },
  {
    slug: "arbitrage-cci",
    title: "Arbitrage CCI : pourquoi privilégier la voie arbitrale ?",
    date: "24 avril 2026",
    category: "Contentieux",
    excerpt:
      "Confidentialité, expertise des arbitres, exécution internationale : l'arbitrage présente des atouts décisifs pour les litiges d'affaires complexes.",
    cover: "#b8952a",
    body: [
      "L'arbitrage est un mode de résolution des litiges par lequel les parties confient le règlement de leur différend à un ou plusieurs arbitres, plutôt qu'aux juridictions étatiques. La Chambre de commerce internationale (CCI) en est l'institution de référence.",
      "Trois avantages le distinguent du contentieux judiciaire : la confidentialité de la procédure, le libre choix d'arbitres spécialisés dans la matière en cause, et la reconnaissance internationale des sentences grâce à la Convention de New York de 1958.",
      "Ces atouts ont un coût : les frais d'arbitrage sont supérieurs à ceux d'une procédure judiciaire classique. L'arbitrage se justifie donc surtout pour les litiges d'enjeu significatif ou comportant une dimension internationale.",
      "La rédaction de la clause compromissoire, au stade du contrat, est déterminante : siège de l'arbitrage, langue, nombre d'arbitres et droit applicable doivent y être précisés avec soin.",
    ],
  },
];

function ScaleSVG({ scrollProgress }: { scrollProgress: any }) {
  const rotate = useTransform(scrollProgress, [0, 0.3, 0.6], [0, -6, 4]);
  const springRotate = useSpring(rotate, { stiffness: 60, damping: 20 });

  return (
    <motion.div style={{ rotate: springRotate, transformOrigin: "50% 20%" }}>
      <svg viewBox="0 0 280 320" style={{ width: "100%", maxWidth: 280 }} fill="none">
        {/* Beam */}
        <line x1="140" y1="40" x2="140" y2="240" stroke={C.accent} strokeWidth="2" opacity="0.6" />
        {/* Crossbar */}
        <line x1="40" y1="100" x2="240" y2="100" stroke={C.accent} strokeWidth="2.5" />
        {/* Top orb */}
        <circle cx="140" cy="40" r="10" fill={C.accent} opacity="0.9" />
        {/* Left pan chain */}
        <line x1="60" y1="100" x2="60" y2="150" stroke={C.accent} strokeWidth="1.5" opacity="0.7" strokeDasharray="3 3" />
        <line x1="40" y1="100" x2="80" y2="100" stroke={C.accent} strokeWidth="2" />
        {/* Left pan */}
        <ellipse cx="60" cy="165" rx="38" ry="10" fill="none" stroke={C.accent} strokeWidth="1.5" opacity="0.8" />
        {/* Right pan chain */}
        <line x1="220" y1="100" x2="220" y2="160" stroke={C.accent} strokeWidth="1.5" opacity="0.7" strokeDasharray="3 3" />
        <line x1="200" y1="100" x2="240" y2="100" stroke={C.accent} strokeWidth="2" />
        {/* Right pan — slightly lower to show tilt */}
        <ellipse cx="220" cy="175" rx="38" ry="10" fill="none" stroke={C.accent} strokeWidth="1.5" opacity="0.8" />
        {/* Base */}
        <rect x="120" y="238" width="40" height="8" rx="2" fill={C.accent} opacity="0.6" />
        <rect x="100" y="246" width="80" height="6" rx="2" fill={C.accent} opacity="0.4" />
        {/* Decorative rings */}
        <circle cx="140" cy="100" r="6" fill={C.accent} opacity="0.7" />
      </svg>
    </motion.div>
  );
}

function Navbar({ page, goTo }: { page: LawPage; goTo: (p: LawPage) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,22,40,0.98)" : C.navy,
      borderBottom: `1px solid ${C.borderDark}`,
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, flexWrap: "wrap" as const, gap: 12 }}>
        <a href="#" onClick={e => { e.preventDefault(); goTo("home"); }} style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={18} color={C.accent} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>Dumont & Associates</div>
              <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Avocats au Barreau de Paris</div>
            </div>
          </div>
        </a>

        <div style={{ display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" as const, justifyContent: "center" }}>
          {NAV_PAGES.map((l) => (
            <a key={l.key} href="#"
              onClick={e => { e.preventDefault(); goTo(l.key); }}
              style={{ color: page === l.key ? C.accent : "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: "0.04em", textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", borderBottom: page === l.key ? `1px solid ${C.accent}` : "1px solid transparent", paddingBottom: 2, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = page === l.key ? C.accent : "rgba(255,255,255,0.65)")}
            >{l.label}</a>
          ))}
          <button onClick={() => goTo("contact")}
            style={{ background: C.accent, color: C.white, padding: "10px 26px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >Consultation gratuite</button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="hero" style={{ position: "relative", minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 50%, rgba(184,149,42,0.06) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(184,149,42,0.04) 0%, transparent 40%)`, pointerEvents: "none" }} />

      {/* Top gold line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)` }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "100px 32px 80px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        {/* Left: headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: C.accent, fontWeight: 600 }}>Corporate & Business Law — Paris</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 700, color: C.white, lineHeight: 1.1, margin: "0 0 28px" }}
          >
            Exceptional<br />
            <span style={{ color: C.accent }}>Counsel</span> for<br />
            Exceptional<br />Businesses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480, marginBottom: 48 }}
          >
            Dumont & Associates is a boutique Parisian law firm specialising in corporate law, M&A, IP, and commercial litigation. We partner with founders, boards, and executives who demand the highest standard of legal counsel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ display: "flex", gap: 16 }}
          >
            <button onClick={() => document.getElementById("consultation")?.scrollIntoView({behavior:"smooth"})}
              style={{ background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >Free Consultation <ArrowRight size={15} /></button>
            <button onClick={() => document.getElementById("practice")?.scrollIntoView({behavior:"smooth"})}
              style={{ border: `1px solid rgba(255,255,255,0.2)`, color: "rgba(255,255,255,0.7)", padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 600 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >Practice Areas</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{ display: "flex", gap: 48, marginTop: 64, paddingTop: 40, borderTop: `1px solid rgba(255,255,255,0.08)` }}
          >
            {caseResults.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Scale SVG */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ width: 280, opacity: 0.85 }}>
            <ScaleSVG scrollProgress={scrollYProgress} />
          </div>
          <div style={{ marginTop: 32, padding: "24px 32px", border: `1px solid ${C.borderGold}`, background: "rgba(184,149,42,0.06)", textAlign: "center" as const }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, color: C.accent, marginBottom: 6 }}>"Excellence. Discretion. Results."</div>
            <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>28 years in business law</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PracticeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="practice" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>What We Do</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.navy, margin: "0 0 16px", fontWeight: 700 }}>Practice Areas</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, maxWidth: 520 }}>We advise on the full spectrum of business and corporate law, from day-one formation through complex litigation and international transactions.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border }}>
          {practiceAreas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ background: C.bgCard, padding: 40, position: "relative", cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bgGold; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.bgCard; }}
            >
              <div style={{ width: 48, height: 48, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.borderGold}` }}>
                <area.icon size={22} color={C.accent} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: C.navy, margin: "0 0 12px", fontWeight: 700 }}>{area.title}</h3>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>{area.desc}</p>
              <div style={{ position: "absolute", bottom: 28, right: 28 }}>
                <ChevronRight size={16} color={C.accent} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AttorneysSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="attorneys" ref={ref} style={{ background: C.navy, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Our Team</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>The Partners</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 480 }}>Three partners. Combined track record exceeding €6 billion in advised transactions and 500+ cases.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {attorneys.map((atty, i) => (
            <motion.div
              key={atty.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.18 }}
              style={{ background: C.navyLight, padding: 40, borderTop: `3px solid ${C.accent}` }}
            >
              <div style={{ width: 72, height: 72, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: C.accent, fontWeight: 700 }}>{atty.name.charAt(0)}</span>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 4px", fontWeight: 700 }}>{atty.name}</h3>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, margin: "0 0 4px", letterSpacing: "0.06em" }}>{atty.title}</p>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 24px" }}>{atty.focus}</p>

              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 28 }}>{atty.bio}</p>

              <div style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 20 }}>
                {[
                  { label: "Admitted", val: atty.bar },
                  { label: "Education", val: atty.education },
                  { label: "Languages", val: atty.languages },
                  { label: "Track Record", val: atty.matters },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.accent, fontWeight: 600, minWidth: 90, flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" ref={ref} style={{ background: C.bg, padding: "80px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: C.navy, padding: "64px 80px", display: "grid", gridTemplateColumns: "1fr 3fr", gap: 64, alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div style={{ width: 3, height: 60, background: C.accent, marginBottom: 24 }} />
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: C.white, margin: 0, fontWeight: 700 }}>Results That Matter</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}
          >
            {caseResults.map((s) => (
              <div key={s.label} style={{ textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: C.bg, padding: "80px 32px 120px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Client Testimonials</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.navy, margin: 0, fontWeight: 700 }}>What Our Clients Say</h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}` }}
            >
              <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={C.accent} color={C.accent} />
                ))}
              </div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: C.navy, lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.navy, margin: "0 0 4px", fontWeight: 700 }}>{t.name}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textMuted, margin: "0 0 8px" }}>{t.title}</p>
                <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, border: `1px solid ${C.borderGold}`, padding: "3px 8px" }}>{t.matter}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="consultation" ref={ref} style={{ background: C.navy, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center" as const, marginBottom: 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Engage Our Firm</span>
            <div style={{ width: 32, height: 1, background: C.accent }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 56px)", color: C.white, margin: "0 0 16px", fontWeight: 700 }}>Fee Structures</h2>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>Transparent pricing. No hidden fees. Full clarity before we begin.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {consultationTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ background: tier.featured ? C.accent : C.navyLight, padding: 48, display: "flex", flexDirection: "column" as const, position: "relative" }}
            >
              {tier.featured && (
                <div style={{ position: "absolute", top: 20, right: 20, background: C.white, color: C.accent, fontSize: 10, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, padding: "3px 10px" }}>Recommended</div>
              )}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: tier.featured ? "rgba(255,255,255,0.7)" : C.accent, letterSpacing: "0.14em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>{tier.duration}</p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 10px", fontWeight: 700 }}>{tier.name}</h3>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: C.white, fontWeight: 700 }}>{tier.price}</div>
              </div>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: tier.featured ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 32, flex: 1 }}>{tier.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px" }}>
                {tier.includes.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Check size={14} color={tier.featured ? C.white : C.accent} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
                style={{ display: "block", textAlign: "center" as const, background: tier.featured ? C.white : "transparent", color: tier.featured ? C.accent : C.white, border: tier.featured ? "none" : `1px solid rgba(255,255,255,0.2)`, padding: "14px 24px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" as const, textDecoration: "none", fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700 }}
              >{tier.cta}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} style={{ background: C.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: C.accent }} />
            <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Frequently Asked</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 4vw, 52px)", color: C.navy, margin: 0, fontWeight: 700 }}>Common Questions</h2>
        </motion.div>

        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const }}
            >
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, color: C.navy, fontWeight: 600 }}>{faq.q}</span>
              <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={18} color={C.accent} />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{ height: openIdx === i ? "auto" : 0, opacity: openIdx === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: C.textMuted, lineHeight: 1.7, paddingBottom: 26, margin: 0 }}>{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer({ goTo }: { goTo: (p: LawPage) => void }) {
  const footerCols: { title: string; links: { label: string; page: LawPage }[] }[] = [
    { title: "Cabinet", links: [
      { label: "Nos services", page: "services" },
      { label: "À propos", page: "about" },
      { label: "Blog", page: "blog" },
      { label: "Contact", page: "contact" },
    ] },
    { title: "Expertise", links: [
      { label: "Droit des sociétés", page: "services" },
      { label: "Fusions & acquisitions", page: "services" },
      { label: "Propriété intellectuelle", page: "services" },
      { label: "Contentieux commercial", page: "services" },
    ] },
    { title: "Informations", links: [
      { label: "Consultation gratuite", page: "contact" },
      { label: "Mentions légales", page: "mentions" },
      { label: "Confidentialité", page: "privacy" },
    ] },
  ];
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.borderDark}`, padding: "80px 32px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <a href="#" onClick={e => { e.preventDefault(); goTo("home"); }} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scale size={18} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: C.white }}>Dumont & Associates</div>
                  <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Avocats au Barreau de Paris</div>
                </div>
              </div>
            </a>
            <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>Cabinet d'avocats spécialisé en droit des sociétés, fusions-acquisitions, propriété intellectuelle et contentieux commercial. Paris, France.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={14} color={C.accent} />
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>contact@aevia.io</span>
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: 20 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 12 }}>
                    <a href="#"
                      onClick={e => { e.preventDefault(); goTo(link.page); }}
                      style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.borderDark}`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
            {[
              { Icon: Mail, text: "contact@aevia.io" },
              { Icon: Clock, text: "Lun–Ven, 9h–19h" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={13} color={C.accent} />
                <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>© 2026 Dumont & Associates. Tous droits réservés. Barreau de Paris.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Shared sub-page hero (theme-native: navy band + gold eyebrow) ────────────
function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section style={{ background: C.navy, padding: "140px 32px 72px", borderBottom: `1px solid ${C.borderDark}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 0%, rgba(184,149,42,0.07) 0%, transparent 55%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)` }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 40, height: 1, background: C.accent }} />
          <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: C.accent, fontWeight: 600 }}>{eyebrow}</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 700, color: C.white, lineHeight: 1.08, margin: subtitle ? "0 0 22px" : 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>{subtitle}</p>
        )}
      </motion.div>
    </section>
  );
}

// ─── SERVICES (detailed practice areas, reusing card design) ──────────────────
function ServicesPage({ goTo }: { goTo: (p: LawPage) => void }) {
  return (
    <div>
      <PageHero
        eyebrow="Nos domaines d'intervention"
        title="Services & expertises"
        subtitle="Nous conseillons sur l'ensemble du spectre du droit des affaires, de la constitution d'une société aux contentieux et transactions internationales les plus complexes."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 1, background: C.border }}>
            {serviceDetails.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                style={{ background: C.bgCard, padding: 44 }}
              >
                <div style={{ width: 48, height: 48, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: `1px solid ${C.borderGold}` }}>
                  <area.icon size={22} color={C.accent} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.navy, margin: "0 0 12px", fontWeight: 700 }}>{area.title}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.65, margin: "0 0 22px" }}>{area.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {area.points.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <Check size={14} color={C.accent} style={{ flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.55 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div style={{ background: C.navy, padding: "56px clamp(32px, 6vw, 72px)", marginTop: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 24 }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, color: C.white, margin: "0 0 10px", fontWeight: 700 }}>Un dossier à confier ?</h2>
              <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: 480 }}>Premier rendez-vous de 45 minutes offert pour évaluer votre situation et identifier la bonne équipe.</p>
            </div>
            <button onClick={() => goTo("contact")}
              style={{ background: C.accent, color: C.white, padding: "16px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >Nous contacter <ArrowRight size={15} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BLOG (index + single article) ────────────────────────────────────────────
function BlogPage({ blogSlug, setBlogSlug }: { blogSlug: string | null; setBlogSlug: (s: string | null) => void }) {
  const post = blogSlug ? blogPosts.find(b => b.slug === blogSlug) : null;

  if (post) {
    return (
      <div>
        <section style={{ background: C.bg, padding: "120px 32px 100px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <button
              onClick={() => setBlogSlug(null)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, marginBottom: 36 }}
              onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >
              <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Tous les articles
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const, border: `1px solid ${C.borderGold}`, padding: "3px 10px" }}>{post.category}</span>
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.textDim }}>{post.date}</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 700, color: C.navy, lineHeight: 1.12, margin: "0 0 32px" }}>{post.title}</h1>
            <div style={{ height: "clamp(200px, 36vw, 340px)", background: `linear-gradient(135deg, ${post.cover}22 0%, ${post.cover}08 100%)`, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, marginBottom: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Scale size={48} color={C.accent} style={{ opacity: 0.4 }} />
            </div>
            {post.body.map((paraTxt, i) => (
              <p key={i} style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, lineHeight: 1.85, marginBottom: 24 }}>{paraTxt}</p>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 24, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 15, color: C.textMuted }}>
              Article rédigé par l'équipe de Dumont & Associates. Ce contenu est fourni à titre informatif et ne constitue pas un conseil juridique.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Le journal du cabinet"
        title="Blog & analyses juridiques"
        subtitle="Nos réflexions sur le droit des affaires : décryptages, points de jurisprudence et conseils pratiques pour les dirigeants et leurs conseils."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {blogPosts.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => { setBlogSlug(p.slug); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" }); }}
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, cursor: "pointer", display: "flex", flexDirection: "column" as const, overflow: "hidden" }}
              >
                <div style={{ height: 170, background: `linear-gradient(135deg, ${p.cover}22 0%, ${p.cover}08 100%)`, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Scale size={32} color={C.accent} style={{ opacity: 0.35 }} />
                </div>
                <div style={{ padding: "26px 28px 30px", display: "flex", flexDirection: "column" as const, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 10, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 700 }}>{p.category}</span>
                    <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textDim }}>· {p.date}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: C.navy, lineHeight: 1.3, margin: "0 0 14px", fontWeight: 700 }}>{p.title}</h2>
                  <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.65, margin: "0 0 18px", flex: 1 }}>{p.excerpt}</p>
                  <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                    Lire l'article <ArrowRight size={14} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── À PROPOS (firm story / values / partners recap) ──────────────────────────
function AboutPage({ goTo }: { goTo: (p: LawPage) => void }) {
  return (
    <div>
      <PageHero
        eyebrow="Le cabinet"
        title="Un conseil d'exception, depuis 1998."
        subtitle="Dumont & Associates est un cabinet d'avocats parisien fondé sur une conviction : le droit des affaires mérite la même exigence que les entreprises qu'il accompagne."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {[
            "Fondé en 1998 par Édouard Dumont après douze années passées au sein d'un cabinet international de premier plan, Dumont & Associates s'est imposé comme une boutique de référence en droit des affaires à Paris.",
            "Notre modèle est celui d'un cabinet à taille humaine où chaque dossier est piloté par un associé. Cette proximité garantit à nos clients un interlocuteur senior à chaque étape, une réactivité sans équivalent et une parfaite confidentialité.",
            "En vingt-huit ans, nous avons conseillé plus de 340 entreprises clientes sur des opérations dont la valeur cumulée dépasse 4,2 milliards d'euros, avec un taux d'issues favorables de 97 % sur nos contentieux.",
          ].map((paraTxt, i) => (
            <p key={i} style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 17, color: C.textMuted, lineHeight: 1.85, marginBottom: 24 }}>{paraTxt}</p>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ background: C.navy, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: C.accent }} />
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Nos valeurs</span>
              <div style={{ width: 32, height: 1, background: C.accent }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 50px)", color: C.white, margin: 0, fontWeight: 700 }}>Excellence. Discrétion. Résultats.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 2 }}>
            {firmValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{ background: C.navyLight, padding: 44, borderTop: `3px solid ${C.accent}` }}
              >
                <div style={{ width: 56, height: 56, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <v.icon size={24} color={C.accent} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: C.white, margin: "0 0 12px", fontWeight: 700 }}>{v.title}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners recap (reuses attorneys data) */}
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: C.accent }} />
              <span style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.accent }}>Notre équipe</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 4vw, 50px)", color: C.navy, margin: 0, fontWeight: 700 }}>Les associés</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {attorneys.map((atty, i) => (
              <motion.div
                key={atty.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{ background: C.bgCard, padding: 40, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}` }}
              >
                <div style={{ width: 64, height: 64, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: C.accent, fontWeight: 700 }}>{atty.name.charAt(0)}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: C.navy, margin: "0 0 4px", fontWeight: 700 }}>{atty.name}</h3>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 13, color: C.accent, margin: "0 0 4px", letterSpacing: "0.04em" }}>{atty.title}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 12, color: C.textDim, margin: "0 0 18px" }}>{atty.focus}</p>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>{atty.bio}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: "center" as const, marginTop: 56 }}>
            <button onClick={() => goTo("contact")}
              style={{ background: C.accent, color: C.white, padding: "16px 40px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "'Source Sans Pro', system-ui", fontWeight: 700, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >Prendre rendez-vous <ArrowRight size={15} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT (info + form, inputs ≥16px) ──────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", background: C.bgCard,
    border: `1px solid ${C.border}`, color: C.navy,
    fontSize: 16, // ≥16px to avoid iOS zoom on focus
    outline: "none", fontFamily: "'Source Sans Pro', system-ui", marginBottom: 18,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent,
    letterSpacing: "0.12em", textTransform: "uppercase" as const, fontWeight: 700,
    marginBottom: 8, display: "block",
  };
  return (
    <div>
      <PageHero
        eyebrow="Engager le cabinet"
        title="Contactez-nous"
        subtitle="Un premier rendez-vous de 45 minutes vous est offert. Nous évaluons votre dossier, identifions la bonne équipe et vous proposons une structure d'honoraires claire."
      />
      <section style={{ background: C.bg, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(40px, 5vw, 72px)" }}>
          {/* Info */}
          <div>
            {[
              { Icon: Mail, label: "Email", value: "contact@aevia.io" },
              { Icon: MapPin, label: "Cabinet", value: "Paris, France" },
              { Icon: Clock, label: "Horaires", value: "Lun – Ven · 9h – 19h" },
              { Icon: Shield, label: "Confidentialité", value: "Secret professionnel garanti" },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 22 }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 6, fontWeight: 700 }}>{label}</div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: C.navy }}>{value}</div>
                </div>
              </div>
            ))}
            <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginTop: 8 }}>
              Le secret professionnel s'applique dès votre première communication substantielle avec le cabinet, avant même toute lettre de mission.
            </p>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, padding: "56px 40px", textAlign: "center" as const, background: C.bgCard }}>
                <Check size={30} color={C.accent} style={{ marginBottom: 18 }} />
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: C.navy, marginBottom: 12, fontWeight: 700 }}>Message envoyé</div>
                <p style={{ fontFamily: "'Source Sans Pro', system-ui", fontSize: 15, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>Merci. Un membre du cabinet vous répondra sous 24 heures ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, padding: "40px 36px" }}>
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} type="text" placeholder="Votre nom" required />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="votre@email.fr" required />
                <label style={labelStyle}>Société</label>
                <input style={inputStyle} type="text" placeholder="Nom de votre entreprise" />
                <label style={labelStyle}>Nature du dossier</label>
                <input style={inputStyle} type="text" placeholder="Ex. : acquisition, contentieux, droit social…" />
                <label style={labelStyle}>Message</label>
                <textarea style={{ ...inputStyle, minHeight: 140, resize: "vertical" as const }} placeholder="Décrivez brièvement votre situation." required />
                <button type="submit"
                  style={{ width: "100%", padding: "16px", background: C.accent, color: C.white, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Source Sans Pro', system-ui", letterSpacing: "0.1em", textTransform: "uppercase" as const }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
                >Demander une consultation</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MENTIONS LÉGALES & CONFIDENTIALITÉ ───────────────────────────────────────
// `mentions` content is verbatim per legal requirement. NEVER print a street address.
function LegalPage({ variant }: { variant: "mentions" | "privacy" }) {
  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: C.navy,
    margin: "40px 0 14px", fontWeight: 700,
  };
  const para: React.CSSProperties = {
    fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: C.textMuted,
    lineHeight: 1.8, marginBottom: 14,
  };
  const strong: React.CSSProperties = { color: C.navy, fontWeight: 700 };

  if (variant === "mentions") {
    return (
      <div>
        <PageHero eyebrow="Informations légales" title="Mentions légales" />
        <section style={{ background: C.bg, padding: "80px 32px 100px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ ...sectionTitle, marginTop: 0 }}>Éditeur du site</h2>
            <p style={para}><span style={strong}>Aevia WS</span> — entrepreneur individuel (auto-entrepreneur).</p>
            <p style={para}>Directeur de la publication : <span style={strong}>Valentin Milliand</span>.</p>
            <p style={para}>SIREN : <span style={strong}>852 546 225</span> — RCS Bourg-en-Bresse.</p>
            <p style={para}>Contact : <span style={strong}>contact@aevia.io</span></p>
            <p style={para}>Adresse du siège social communiquée sur demande à contact@aevia.io.</p>

            <h2 style={sectionTitle}>TVA</h2>
            <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

            <h2 style={sectionTitle}>Hébergeur</h2>
            <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

            <h2 style={sectionTitle}>Propriété intellectuelle</h2>
            <p style={para}>
              L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit
              de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable
              de l'éditeur.
            </p>

            <h2 style={sectionTitle}>Responsabilité</h2>
            <p style={para}>
              Les informations diffusées sur ce site sont fournies à titre indicatif et ne constituent pas un conseil
              juridique. Elles ne sauraient engager la responsabilité de l'éditeur ou du cabinet.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Protection des données" title="Politique de confidentialité" />
      <section style={{ background: C.bg, padding: "80px 32px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...para, fontStyle: "italic", color: C.textDim }}>Dernière mise à jour : juin 2026.</p>

          <h2 style={{ ...sectionTitle, marginTop: 24 }}>Responsable du traitement</h2>
          <p style={para}>
            Le responsable du traitement des données personnelles est <span style={strong}>Aevia WS</span>, éditeur du
            site. Pour toute question, écrivez à <span style={strong}>contact@aevia.io</span>.
          </p>

          <h2 style={sectionTitle}>Données collectées</h2>
          <p style={para}>
            Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact
            (nom, email, société et message), aux seules fins de répondre à votre demande.
          </p>

          <h2 style={sectionTitle}>Finalité et base légale</h2>
          <p style={para}>
            Vos données sont traitées sur la base de votre consentement et de l'intérêt légitime du cabinet à répondre aux
            sollicitations. Elles ne font l'objet d'aucune cession à des tiers à des fins commerciales.
          </p>

          <h2 style={sectionTitle}>Durée de conservation</h2>
          <p style={para}>
            Les données issues du formulaire de contact sont conservées le temps nécessaire au traitement de votre demande,
            puis archivées ou supprimées conformément aux obligations légales applicables.
          </p>

          <h2 style={sectionTitle}>Vos droits</h2>
          <p style={para}>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et
            d'opposition au traitement de vos données. Pour exercer ces droits, écrivez à contact@aevia.io.
          </p>

          <h2 style={sectionTitle}>Cookies</h2>
          <p style={para}>
            Ce site ne dépose pas de cookies de suivi publicitaire. Seuls des cookies techniques strictement nécessaires
            au fonctionnement du site peuvent être utilisés.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function LawFirmTemplate() {
  const [page, setPage] = useState<LawPage>("home");
  const [blogSlug, setBlogSlug] = useState<string | null>(null);

  const goTo = (p: LawPage) => {
    setPage(p);
    setBlogSlug(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <main style={{ background: C.bg, minHeight: "100vh" }}>
      <Navbar page={page} goTo={goTo} />

      {/* ══════════ HOME (original single-page content, unchanged) ══════════ */}
      {page === "home" && (
        <>
          <HeroSection />
          <PracticeSection />
          <AttorneysSection />
          <ResultsSection />
          <TestimonialsSection />
          <ConsultationSection />
          <FAQSection />
        </>
      )}

      {/* ══════════ EXTRA PAGES (theme-native, built from C tokens) ══════════ */}
      {page === "services" && <ServicesPage goTo={goTo} />}
      {page === "blog" && <BlogPage blogSlug={blogSlug} setBlogSlug={setBlogSlug} />}
      {page === "about" && <AboutPage goTo={goTo} />}
      {page === "contact" && <ContactPage />}
      {page === "mentions" && <LegalPage variant="mentions" />}
      {page === "privacy" && <LegalPage variant="privacy" />}

      <Footer goTo={goTo} />
    </main>
  );
}
