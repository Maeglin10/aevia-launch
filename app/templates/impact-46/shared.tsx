"use client";

import React from "react";
import { motion, useTransform, useSpring } from "framer-motion";
import {
  Briefcase, Scale, Shield, BookOpen, Users, FileText, Award
} from "lucide-react";

export const C = {
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

export const navLinks = [
  { label: "Accueil", href: "/templates/impact-46" },
  { label: "Services", href: "/templates/impact-46/services" },
  { label: "Blog", href: "/templates/impact-46/blog" },
  { label: "À propos", href: "/templates/impact-46/about" },
  { label: "Contact", href: "/templates/impact-46/contact" },
];

export const practiceAreas = [
  { icon: Briefcase, title: "Corporate Law", desc: "Entity formation, governance, shareholder agreements, and ongoing corporate counsel for businesses at every stage." },
  { icon: Scale, title: "Mergers & Acquisitions", desc: "Buy-side and sell-side M&A, due diligence, deal structuring, and post-merger integration support." },
  { icon: Shield, title: "Intellectual Property", desc: "Patent strategy, trademark registration, licensing, and IP portfolio management for technology and creative enterprises." },
  { icon: BookOpen, title: "Commercial Litigation", desc: "Business disputes, contract enforcement, shareholder conflicts, and complex commercial arbitration." },
  { icon: Users, title: "Employment Law", desc: "Employment contracts, executive compensation, non-compete agreements, and workplace compliance programs." },
  { icon: FileText, title: "Tax & Structuring", desc: "Corporate tax planning, transaction structuring, international tax strategy, and regulatory compliance." },
];

export const attorneys = [
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

export const caseResults = [
  { value: "€4.2B+", label: "M&A Deal Value Advised" },
  { value: "97%", label: "Favorable Outcomes" },
  { value: "28", label: "Years in Practice" },
  { value: "340+", label: "Corporate Clients" },
];

export const testimonials = [
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

export const consultationTiers = [
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

export const faqs = [
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

export const serviceDetails = [
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

export const firmValues = [
  { icon: Award, title: "Excellence", text: "Vingt-huit années d'exercice au plus haut niveau du droit des affaires parisien, au service d'exigences sans compromis." },
  { icon: Shield, title: "Discrétion", text: "Le secret professionnel et la confidentialité guident chacune de nos interventions, dès le premier échange." },
  { icon: Scale, title: "Résultats", text: "97 % d'issues favorables. Nous ne mesurons notre réussite qu'à l'aune de celle de nos clients." },
];

export const blogPosts = [
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

export function ScaleSVG({ scrollProgress }: { scrollProgress: any }) {
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

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
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
