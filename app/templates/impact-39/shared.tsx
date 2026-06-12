"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ChevronDown,
  Check,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
} from "lucide-react";

// ─── Design tokens ───────────────────────────────────────────────────────────
export const C = {
  bg: "#ffffff",
  bgAlt: "#f1f5f9",
  text: "#1e3a5f",
  textMuted: "#64748b",
  orange: "#ea580c",
  orangeLight: "#fff7ed",
  orangeDark: "#c2410c",
  navy: "#1e3a5f",
  navyLight: "#2d5282",
  white: "#ffffff",
  border: "#e2e8f0",
  borderLight: "#f8fafc",
};

export const SANS = "'Manrope', system-ui, sans-serif";

// ─── Static data ─────────────────────────────────────────────────────────────
import { Home, Building2, Package } from "lucide-react";

export const SERVICES_DATA = [
  {
    icon: Home,
    name: "Déménagement local",
    tagline: "Même ville",
    shortDesc: "Forfait à partir de 299 € — 2 déménageurs + camion 20 m³",
    desc: "Votre déménagement dans la même ville géré de A à Z : emballage des cartons fragiles, chargement soigné, transport sécurisé et installation dans votre nouveau logement.",
    features: ["2 déménageurs expérimentés", "Camion 20 m³ inclus", "Protection sol et murs", "Démontage/remontage meubles"],
    from: "299 €",
  },
  {
    icon: Truck,
    name: "Déménagement longue distance",
    tagline: "France entière",
    shortDesc: "Devis sur mesure — suivi GPS en temps réel",
    desc: "Nous couvrons toute la France métropolitaine. Votre mobilier est inventorié, assuré et livré à la date convenue, avec suivi GPS tout au long du trajet.",
    features: ["Suivi GPS en temps réel", "Date de livraison garantie", "Assurance valeur déclarée", "Stockage tampon disponible"],
    from: "Sur devis",
  },
  {
    icon: Building2,
    name: "Déménagement international",
    tagline: "Europe & monde",
    shortDesc: "Emballage douanes inclus — coordination sur mesure",
    desc: "Déménagement en Europe ou hors UE : gestion des formalités douanières, emballage export renforcé et coordination avec nos partenaires locaux à destination.",
    features: ["Assistance douanière incluse", "Emballage export renforcé", "Partenaires locaux à destination", "Assurance internationale"],
    from: "Sur devis",
  },
  {
    icon: Building2,
    name: "Déménagement d'entreprise",
    tagline: "Bureaux & locaux pro",
    shortDesc: "Planification dédiée — IT, mobilier, archives",
    desc: "Transferts de bureaux planifiés pour minimiser l'interruption d'activité. Inventaire détaillé, étiquetage, manutention IT et remise en place dans vos nouveaux locaux.",
    features: ["Chef de projet dédié", "Manutention matériel IT", "Interventions week-end/nuit", "Traçabilité complète des actifs"],
    from: "Sur devis",
  },
  {
    icon: Package,
    name: "Piano & objets précieux",
    tagline: "Manutention spécialisée",
    shortDesc: "Assurance renforcée — équipe certifiée",
    desc: "Pianos droits et à queue, œuvres d'art, antiquités, caves à vin, coffres-forts : notre équipe spécialisée prend en charge vos biens les plus précieux avec l'équipement adapté.",
    features: ["Équipe certifiée piano", "Sangles et chariots spéciaux", "Assurance valeur déclarée", "Conditionnement sur mesure"],
    from: "Sur devis",
  },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Demandez un devis", desc: "Renseignez votre déménagement en ligne. Vous recevez une estimation ferme sous 2 h, sans surprise." },
  { step: "02", title: "Réservez votre date", desc: "Choisissez votre créneau. Nous confirmons votre équipe et le camion 48 h avant le jour J." },
  { step: "03", title: "Nous emballons & chargeons", desc: "Notre équipe arrive à l'heure, protège vos affaires et charge avec soin. Chaque article est documenté." },
  { step: "04", title: "Livré & installé", desc: "Nous livrons, déchargeons et installons vos meubles exactement où vous le souhaitez." },
];

export const STATS = [
  { value: "18 400+", label: "Déménagements réussis" },
  { value: "47", label: "Départements couverts" },
  { value: "4,9", label: "Note moyenne" },
  { value: "12", label: "Ans d'expérience" },
];

export const PRICING_CARDS = [
  {
    name: "Studio / T1",
    price: "299 €",
    suffix: "à partir de",
    period: "déménagement local",
    features: ["2 déménageurs", "Jusqu'à 4 h", "Camion inclus", "Protection de base", "Protection parquet"],
    highlight: false,
  },
  {
    name: "T2 / T3",
    price: "549 €",
    suffix: "à partir de",
    period: "déménagement local",
    features: ["3 déménageurs", "Jusqu'à 7 h", "Grand camion inclus", "Protection complète", "Démontage meubles", "Protection sols & murs", "3 cartons-penderies"],
    highlight: true,
  },
  {
    name: "T4 et plus",
    price: "899 €",
    suffix: "à partir de",
    period: "déménagement local",
    features: ["4 déménageurs", "Journée complète", "Camion 26 m³", "Protection premium", "Emballage complet", "Service blanc", "Coordinateur dédié", "Garde-meuble 30 j offerts"],
    highlight: false,
  },
];

export const TESTIMONIALS = [
  {
    name: "Sophie Marchand",
    role: "Propriétaire, Paris 11e",
    avatar: "SM",
    rating: 5,
    text: "L'équipe a déménagé notre appartement de 4 pièces en 6 h chrono, sans aucun dommage. Professionnels, ponctuels et vraiment attentionnés. Je ne ferai plus jamais appel à quelqu'un d'autre.",
  },
  {
    name: "David Renaud",
    role: "DG, TechParis",
    avatar: "DR",
    rating: 5,
    text: "Ils ont déménagé nos 60 postes de travail pendant le week-end. Le lundi matin, tout était branché et étiqueté. Zéro interruption d'activité. Vraiment impressionnant.",
  },
  {
    name: "Lucie Fontaine",
    role: "Locataire, Lyon",
    avatar: "LF",
    rating: 5,
    text: "Déménagement Paris → Lyon en solo, j'avais peur de confier mes affaires. Suivi GPS tout au long du trajet, livraison 2 h en avance. Je recommande les yeux fermés.",
  },
];

export const FAQS = [
  { q: "Combien de temps à l'avance dois-je réserver ?", a: "Pour un déménagement local, 1 à 2 semaines suffisent. Pour une longue distance ou un déménagement d'entreprise, prévoyez 3 à 4 semaines. Nous pouvons parfois intervenir en urgence sous 48 à 72 h selon les disponibilités." },
  { q: "Mes meubles sont-ils assurés pendant le transport ?", a: "Tous nos déménagements incluent une assurance responsabilité civile. Nous recommandons fortement l'assurance valeur déclarée qui couvre réparation ou remplacement à la valeur réelle. Demandez le détail à votre coordinateur." },
  { q: "Fournissez-vous les cartons et matériaux d'emballage ?", a: "Oui. Cartons, adhésif, papier bulle, couvertures de protection, cartons-penderies — tout le matériel est disponible. Le service emballage complet ou partiel est également proposé en option." },
  { q: "Quels objets ne pouvez-vous pas transporter ?", a: "Matières dangereuses (peinture, gaz), plantes (hors région), animaux vivants. Nous conseillons de transporter soi-même bijoux, espèces et documents importants. Votre coordinateur vous guidera lors de l'état des lieux." },
  { q: "Quelle est votre politique d'annulation ?", a: "Annulation gratuite jusqu'à 7 jours avant la date. Entre 3 et 7 jours : frais de 10 %. Moins de 72 h : frais de 25 %. Contactez-nous le plus tôt possible, nous trouvons toujours une solution." },
  { q: "Proposez-vous un garde-meuble si mon nouveau logement n'est pas disponible ?", a: "Oui, notre entrepôt sécurisé et climatisé peut accueillir vos affaires le temps nécessaire. Le premier mois est offert pour les déménagements T4+ locaux. Tarifs à partir de 79 €/mois." },
];

export const STORAGE_BOXES = [
  { size: "5 m²", price: "79 €/mois", desc: "Idéal studio ou petite cave", features: ["Accès 7j/7 8h-20h", "Vidéosurveillance 24/7", "Climatisé", "Serrure personnelle"] },
  { size: "10 m²", price: "139 €/mois", desc: "Parfait pour un T2/T3", features: ["Accès 7j/7 8h-20h", "Vidéosurveillance 24/7", "Climatisé", "Serrure personnelle", "Rayonnages inclus"] },
  { size: "20 m²", price: "239 €/mois", desc: "Grande maison ou local pro", features: ["Accès 7j/7 8h-20h", "Vidéosurveillance 24/7", "Climatisé", "Serrure personnelle", "Rayonnages inclus", "Rampe de chargement"] },
];

export const ARTICLES = [
  {
    id: 1,
    category: "Organisation",
    readTime: "5 min",
    title: "Comment préparer votre déménagement 8 semaines à l'avance",
    excerpt: "Une check-list semaine par semaine pour ne rien oublier et arriver serein le jour J.",
    full: `**Semaine 8 — Planifier**\nDécidez de la date, obtenez vos devis, réservez votre équipe. Prévenez votre employeur, votre école, votre banque.\n\n**Semaine 7 — Trier**\nFaites le tour de chaque pièce : donnez, vendez ou jetez ce que vous ne souhaitez plus emmener. Moins vous déménagez, moins c'est cher.\n\n**Semaine 6 — Commandez les cartons**\nPrévoyez large : 10 cartons par pièce en moyenne. Commandez aussi papier bulle, film étirable et marqueurs.\n\n**Semaines 5-4 — Emballez les affaires non courantes**\nLivres, décorations, vêtements hors-saison, photos. Étiquetez chaque carton : contenu + pièce de destination.\n\n**Semaine 3 — Démarches administratives**\nChangement d'adresse : La Poste, impôts, CAF, médecin, assurances, abonnements. Résiliez eau/gaz/électricité à l'ancienne adresse, ouvrez les contrats à la nouvelle.\n\n**Semaine 2 — Finaliser la logistique**\nConfirmez l'heure avec vos déménageurs, réservez les Monte-charge ou parkings si besoin, organisez la garde des enfants/animaux le jour J.\n\n**Veille — Préparer l'essentiel**\nPréparez un sac "premier jour" : draps, cafetière, chargeurs, médicaments, documents importants. Ce sac voyage avec vous, pas dans le camion.\n\n**Jour J — Superviser**\nSoyez présent pour l'état des lieux de départ et d'arrivée. Vérifiez chaque pièce avant le départ du camion.`,
  },
  {
    id: 2,
    category: "Emballage",
    readTime: "4 min",
    title: "Emballer sa vaisselle : les 5 erreurs à éviter",
    excerpt: "Une assiette fêlée est vite arrivée. Voici les pièges classiques et comment les contourner.",
    full: `**Erreur 1 — Utiliser des cartons trop grands**\nLes cartons volumineux deviennent trop lourds et se déforment. Utilisez des cartons "vaisselle" de petite taille, robustes double cannelure.\n\n**Erreur 2 — Ne pas tasser les espaces vides**\nUn vide dans le carton = vaisselle qui bouge = casse assurée. Comblez avec du papier froissé, des torchons ou du papier bulle.\n\n**Erreur 3 — Poser les assiettes à plat**\nContre-intuitif mais vrai : posez vos assiettes debout (sur la tranche), comme dans un lave-vaisselle. Elles résistent beaucoup mieux aux chocs verticaux.\n\n**Erreur 4 — Emballer les verres sans protection intérieure**\nGlissez une feuille de papier froissé à l'intérieur de chaque verre, puis enroulez-le dans une deuxième feuille à l'extérieur. Doublez la protection pour les verres à pied.\n\n**Erreur 5 — Ne pas indiquer "FRAGILE" et "HAUT"**\nUn carton non étiqueté risque d'être posé à l'envers ou sous une pile lourde. Marquez les quatre faces avec "FRAGILE" et une flèche "HAUT" bien visible.`,
  },
  {
    id: 3,
    category: "Conseils pratiques",
    readTime: "4 min",
    title: "Déménager avec des enfants et des animaux",
    excerpt: "Le déménagement peut être stressant pour les plus jeunes et pour vos compagnons à quatre pattes. Nos conseils.",
    full: `**Pour les enfants**\n\n- **Impliquez-les** dans le projet : laissez-les choisir la couleur de leur future chambre, emballer leurs jouets préférés.\n- **Gardez la routine** jusqu'au dernier moment : mêmes horaires de repas, de coucher, d'école.\n- **Prévoyez une garde** le jour du déménagement pour les moins de 6 ans : un chantier n'est pas un lieu sûr pour un enfant.\n- **Installez leur chambre en premier** à la nouvelle adresse pour qu'ils retrouvent rapidement leurs repères.\n\n**Pour les chats**\n\n- Confinés dans une pièce vide la veille, puis dans leur caisse le jour J.\n- À l'arrivée, enfermez-les dans une pièce avec litière, eau et gamelle le temps de déposer les cartons.\n- Ne les laissez pas sortir avant 2 semaines : ils risquent de tenter de retourner à l'ancien logement.\n\n**Pour les chiens**\n\n- Sortez-les le matin avant l'arrivée des déménageurs pour les fatiguer.\n- Confiez-les à un ami ou à un dog-sitter pour la journée si possible.\n- À l'arrivée, faites-leur visiter le nouveau logement en laisse avant de les libérer.`,
  },
  {
    id: 4,
    category: "Guide",
    readTime: "6 min",
    title: "Choisir la bonne taille de camion",
    excerpt: "Volume, poids, accès : tout ce qu'il faut savoir pour ne pas se retrouver avec un camion trop petit.",
    full: `**Calculer votre volume**\n\nEn moyenne : studio ≈ 10-15 m³ / T2 ≈ 20-25 m³ / T3 ≈ 30-35 m³ / T4 ≈ 40-50 m³.\nAjoutez 15-20 % si vous avez beaucoup de livres, un piano, une cave bien fournie ou des équipements sportifs.\n\n**Les tailles de camions**\n\n| Camion | Volume | Idéal pour |\n|--------|--------|------------|\n| 12 m³ | 12 m³ | Studio, T1 |\n| 20 m³ | 20 m³ | T2, petite T3 |\n| 26 m³ | 26 m³ | T3/T4 standard |\n| 33 m³ | 33 m³ | Grande maison |\n\n**Points de vigilance**\n\n- **Poids total autorisé (PTAC)** : un camion de 20 m³ dépasse 3,5 t. Des restrictions peuvent s'appliquer en centre-ville (crit'air, ZFE).\n- **Gabarit** : verifiez la hauteur des passages sous voitures et les largeurs de rues dans les deux adresses.\n- **Hayon ou rampe** : indispensable pour lourds équipements. Précisez-le à votre devis.\n\n**Notre recommandation**\n\nEn cas de doute, prenez un camion légèrement plus grand. Le surcoût est faible et vous évitez d'avoir à faire deux rotations.`,
  },
];

// ─── Shared utilities ─────────────────────────────────────────────────────────
export function SectionReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function FAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ background: C.bg, border: `1px solid ${open ? C.orange : C.border}`, borderRadius: 12, padding: "20px 24px", cursor: "pointer", marginBottom: 8, transition: "border-color 0.2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={20} color={C.textMuted} />
          </motion.div>
        </div>
        {open && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
            style={{ marginTop: 14, fontSize: 15, color: C.textMuted, lineHeight: 1.75 }}>
            {faq.a}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export function StepTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 2, background: C.border }} />
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        style={{ position: "absolute", top: 28, left: 0, height: 2, background: C.orange }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }} className="grid md:grid-cols-1">
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div key={step.step} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }} style={{ textAlign: "center", padding: "0 16px" }} className="md:mb-8">
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative", zIndex: 1, fontFamily: SANS, fontWeight: 800, fontSize: 16, color: C.white }}>
              {step.step}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 10 }}>{step.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay }} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, color: C.white }}>{stat.value}</div>
      <div style={{ fontSize: 15, color: "#93c5fd", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
    </motion.div>
  );
}

export function TruckSVG({ truckX }: { truckX: any }) {
  return (
    <motion.div style={{ x: truckX, position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)" }}>
      <svg viewBox="0 0 200 80" style={{ width: 220, height: 88 }}>
        <rect x="60" y="10" width="130" height="50" rx="4" fill={C.orange} />
        <rect x="10" y="20" width="55" height="40" rx="4" fill={C.orangeDark} />
        <rect x="15" y="24" width="42" height="22" rx="2" fill="#93c5fd" opacity="0.7" />
        <circle cx="35" cy="62" r="12" fill={C.navy} />
        <circle cx="35" cy="62" r="6" fill="#94a3b8" />
        <circle cx="155" cy="62" r="12" fill={C.navy} />
        <circle cx="155" cy="62" r="6" fill="#94a3b8" />
        <circle cx="135" cy="62" r="12" fill={C.navy} />
        <circle cx="135" cy="62" r="6" fill="#94a3b8" />
        <line x1="0" y1="74" x2="200" y2="74" stroke={C.border} strokeWidth="2" />
        <text x="125" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily={SANS}>SWIFT MOVE</text>
      </svg>
    </motion.div>
  );
}
