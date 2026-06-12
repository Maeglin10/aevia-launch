"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Stethoscope, Syringe, Shield, Heart, Award, Users } from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: "#fafffe",
  bgLight: "#d8f3dc",
  bgSection: "#f2fbf5",
  text: "#1a3a2a",
  textMuted: "#4a7060",
  accent: "#2d6a4f",
  accentLight: "#d8f3dc",
  accentDark: "#1e4d38",
  sand: "#f4a261",
  sandLight: "#fef3e8",
  white: "#FFFFFF",
  border: "#b7d9c4",
  shadow: "0 4px 24px rgba(45,106,79,0.09)",
  shadowLg: "0 12px 48px rgba(45,106,79,0.16)",
};

export const FONT = "'Nunito', system-ui, sans-serif";

// ─── Shared helpers ────────────────────────────────────────────────────────────
export function SectionBadge({ label }: { label: string }) {
  return (
    <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
      {label}
    </div>
  );
}

// ─── Animated Paw SVG ─────────────────────────────────────────────────────────
export function AnimatedPaw() {
  return (
    <motion.div
      style={{ position: "relative", width: 380, height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.svg
        viewBox="0 0 200 200" width={230} height={230}
        style={{ position: "relative", zIndex: 1 }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, type: "spring", stiffness: 120, damping: 10 }}
      >
        <motion.ellipse cx="100" cy="130" rx="42" ry="38" fill={C.accent}
          animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="60" cy="82" r="22" fill={C.accent}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.1 }} />
        <motion.circle cx="100" cy="68" r="24" fill={C.accent}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.25 }} />
        <motion.circle cx="140" cy="82" r="22" fill={C.accent}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.15 }} />
        <motion.path
          d="M100 115 C100 115, 86 100, 86 90 C86 84, 91 79, 100 88 C109 79, 114 84, 114 90 C114 100, 100 115, 100 115 Z"
          fill="rgba(255,255,255,0.85)"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        />
      </motion.svg>
      <motion.div
        style={{ position: "absolute", top: 24, right: 8, background: C.sand, color: C.white, borderRadius: 12, padding: "7px 15px", fontSize: 13, fontWeight: 800, fontFamily: FONT, boxShadow: "0 4px 16px rgba(244,162,97,0.4)", zIndex: 2 }}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }}
      >
        Urgences 24h/7j
      </motion.div>
      <motion.div
        style={{ position: "absolute", bottom: 36, left: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "9px 17px", fontSize: 13, fontWeight: 700, fontFamily: FONT, color: C.text, boxShadow: C.shadow, zIndex: 2 }}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.5 }}
      >
        4.8 / 5 — 2 400+ avis
      </motion.div>
    </motion.div>
  );
}

// ─── Pet Species Tabs ──────────────────────────────────────────────────────────
export function PetTabs() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const species = [
    { label: "Chiens", emoji: "🐕", services: ["Vaccination annuelle", "Stérilisation", "Bilan santé senior", "Traitement antiparasitaire", "Chirurgie douce", "Dentisterie vétérinaire"] },
    { label: "Chats", emoji: "🐈", services: ["Primo-vaccination", "Identification puce", "Castration / Stérilisation", "Traitement leucose FIV", "Soins dermatologiques", "Gestion diabète félin"] },
    { label: "Exotiques", emoji: "🐇", services: ["Lapins & rongeurs", "Oiseaux & reptiles", "Poissons & tortues", "Examen complet", "Chirurgie spécialisée", "Alimentation conseils"] },
  ];
  return (
    <div ref={ref} style={{ fontFamily: FONT }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
        {species.map((s, i) => (
          <motion.button type="button" key={s.label} onClick={() => setActive(i)}
            style={{ background: active === i ? C.accent : C.white, color: active === i ? C.white : C.text, border: `2px solid ${active === i ? C.accent : C.border}`, borderRadius: 30, padding: "10px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <TemplateIcon emoji={s.emoji} size={18} />{s.label}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, maxWidth: 800, margin: "0 auto" }}>
          {species[active].services.map((service) => (
            <div key={service} style={{ background: C.white, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, boxShadow: C.shadow }}>
              <Shield size={14} color={C.accent} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{service}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export const SERVICES_DATA = [
  { icon: <Stethoscope size={26} color="#2d6a4f" />, title: "Consultations", desc: "Bilan de santé complet, suivi régulier et prévention pour votre animal.", tag: "Essentiel" },
  { icon: <Syringe size={26} color="#2d6a4f" />, title: "Vaccinations", desc: "Protocoles vaccinaux adaptés à chaque espèce et mode de vie.", tag: "Prévention" },
  { icon: <Shield size={26} color="#2d6a4f" />, title: "Chirurgie", desc: "Chirurgie douce avec anesthésie sécurisée et monitoring cardiaque.", tag: "Spécialisé" },
  { icon: <Heart size={26} color="#2d6a4f" />, title: "Cardiologie", desc: "Échographie cardiaque et suivi des pathologies cardiovasculaires.", tag: "Expert" },
  { icon: <Award size={26} color="#2d6a4f" />, title: "Dermatologie", desc: "Diagnostic et traitement des affections cutanées chroniques.", tag: "Spécialisé" },
  { icon: <Users size={26} color="#2d6a4f" />, title: "Urgences 24h/7j", desc: "Équipe d'astreinte pour les urgences vitales, 24h/24, 7j/7.", tag: "Urgent", urgent: true },
];

export const TEAM_DATA = [
  { name: "Dr. Marie Fontaine", role: "Vétérinaire généraliste", specialty: "Chiens & chats, chirurgie douce", exp: "14 ans", initials: "MF", color: C.accent, photo: "photo-1559839734-2b71ea197ec2" },
  { name: "Dr. Pierre Leroy", role: "Vétérinaire spécialisé", specialty: "Cardiologie & imagerie médicale", exp: "10 ans", initials: "PL", color: "#4a7aa0", photo: "photo-1612349317150-e413f6a5b16d" },
  { name: "Dr. Nadia Sall", role: "Vétérinaire exotiques", specialty: "NAC — oiseaux, reptiles, rongeurs", exp: "8 ans", initials: "NS", color: "#7a5ea0", photo: "photo-1594824476967-48c8b964273f" },
  { name: "Dr. Lucas Martin", role: "Vétérinaire urgentiste", specialty: "Médecine d'urgence & réanimation", exp: "6 ans", initials: "LM", color: "#a05e5e", photo: "photo-1582750433449-648ed127bb54" },
];

export const TESTIMONIALS = [
  { name: "Julie & Max (Border Collie)", text: "L'équipe PawCare a sauvé la vie de Max lors d'une urgence nocturne. Réactivité exemplaire, soins impeccables. Nous ne changerons jamais de clinique.", stars: 5 },
  { name: "Antoine & ses 2 chats", text: "Dr. Fontaine est une perle. Elle prend le temps d'expliquer chaque diagnostic, elle est douce avec les chats et toujours disponible pour répondre à nos questions.", stars: 5 },
  { name: "Léa & Noisette (lapin)", text: "Difficile de trouver un vétérinaire pour les lapins. Dr. Sall est une vraie spécialiste NAC — Noisette est en parfaite santé grâce à elle !", stars: 5 },
];

export const PLANS = [
  { name: "Basic Care", price: "25", period: "/ consultation", desc: "Pour les soins courants et le suivi préventif.", features: ["Consultation vétérinaire", "Déparasitage interne", "Conseils nutrition", "Carnet de santé digital", "Devis gratuit"], cta: "Prendre RDV", highlight: false, emoji: "🐾" },
  { name: "Complete Care", price: "89", period: "/ mois", desc: "La formule tout-inclus pour un suivi serein.", features: ["Consultations illimitées", "Vaccinations annuelles", "Bilan sanguin semestriel", "Détartrage dentaire", "Urgences prioritaires", "Application suivi santé"], cta: "S'abonner", highlight: true, emoji: "⭐" },
  { name: "Premium Care", price: "149", period: "/ mois", desc: "Le meilleur pour les animaux qui méritent tout.", features: ["Tout Complete Care", "Chirurgies incluses (hors implants)", "Suivi nutritionnel personnalisé", "Téléconsultation 7j/7", "Assurance accidents incluse", "Livraison médicaments"], cta: "Choisir Premium", highlight: false, emoji: "💎" },
];

export const FAQS = [
  { q: "Comment prendre rendez-vous en urgence ?", a: "Appelez directement notre ligne urgences disponible 24h/24 et 7j/7. Pour les urgences vitales, notre équipe d'astreinte intervient en moins de 30 minutes." },
  { q: "Acceptez-vous les animaux exotiques (lapins, oiseaux, reptiles) ?", a: "Oui ! Dr. Nadia Sall est spécialisée NAC (Nouveaux Animaux de Compagnie). Elle reçoit lapins, cobayes, oiseaux, reptiles et poissons du lundi au vendredi sur rendez-vous." },
  { q: "Travaillez-vous avec les assurances animaux ?", a: "Nous collaborons avec les principaux assureurs vétérinaires : Agria, Santévet, Assur O'Poil et April. Nous émettons les factures dans le format requis pour vos remboursements." },
  { q: "Proposez-vous la téléconsultation ?", a: "Oui, la téléconsultation est disponible pour les abonnés Complete Care et Premium Care. Idéale pour les questions de suivi, l'interprétation de résultats ou les conseils comportementaux." },
  { q: "Quelle est la durée d'une consultation standard ?", a: "Une consultation standard dure entre 20 et 30 minutes. Les consultations spécialisées (cardiologie, dermatologie) peuvent durer jusqu'à 45 minutes. Nous ne consultons jamais en flux tendu." },
];

export const FULL_SERVICES = [
  { icon: <Stethoscope size={28} color={C.accent} />, title: "Consultation générale", price: "À partir de 25 €", desc: "Examen clinique complet : auscultation, palpation, bilan cutané et buccal. Compte-rendu digital remis en fin de consultation.", details: ["Bilan annuel de prévention", "Suivi de pathologie chronique", "Deuxième avis vétérinaire", "Consultation pré-opératoire"] },
  { icon: <Syringe size={28} color={C.accent} />, title: "Vaccinations", price: "À partir de 38 €", desc: "Protocoles vaccinaux personnalisés selon l'espèce, le mode de vie (intérieur / extérieur) et les risques géographiques.", details: ["Primo-vaccination chiot / chaton", "Rappels annuels", "Vaccin rage (voyage)", "Certificat international"] },
  { icon: <Shield size={28} color={C.accent} />, title: "Chirurgie", price: "Sur devis", desc: "Bloc opératoire équipé : monitoring cardiaque, respirateur, écho Doppler. Réveil en salle de soins intensifs.", details: ["Stérilisation / Castration", "Chirurgie des tissus mous", "Orthopédie", "Chirurgie dentaire"] },
  { icon: <Heart size={28} color={C.accent} />, title: "Cardiologie", price: "À partir de 90 €", desc: "Échocardiographie Doppler couleur, holter cardiaque 24h, suivi des insuffisances cardiaques congénitales et acquises.", details: ["Échocardiographie", "Holter cardiaque", "Traitement HTAP", "Suivi CMD / RCM"] },
  { icon: <Award size={28} color={C.accent} />, title: "Dentisterie", price: "À partir de 60 €", desc: "Détartrage ultrasonique, radiographie dentaire numérique, extraction et soins endodontiques pour chiens, chats et NAC.", details: ["Détartrage sous AG", "Extraction dentaire", "Traitement parodontal", "Bilan dentaire digital"] },
  { icon: <Users size={28} color={C.accent} />, title: "NAC — Exotiques", price: "À partir de 40 €", desc: "Spécialiste dédiée aux nouveaux animaux de compagnie : lapins, cochons d'Inde, furets, perroquets, reptiles, poissons.", details: ["Lapins & rongeurs", "Reptiles & amphibiens", "Oiseaux psittacidés", "Chirurgie NAC"] },
  { icon: <Stethoscope size={28} color={C.sand} />, title: "Urgences 24h/7j", price: "Supplément urgence : 35 €", desc: "Médecin urgentiste d'astreinte toutes les nuits et week-ends. Salle de triage et soins intensifs disponibles.", details: ["Intoxications", "Traumatismes", "Détresse respiratoire", "Choc anaphylactique"] },
  { icon: <Heart size={28} color={C.accent} />, title: "Dermatologie", price: "À partir de 65 €", desc: "Test d'allergènes, biopsies cutanées, traitement des dermatoses chroniques et suivi des pathologies auto-immunes.", details: ["Test d'intradermoréaction", "Traitement au topique", "Gale, teigne", "Dermatoses hormonales"] },
];
