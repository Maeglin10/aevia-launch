"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle, Calendar, ChevronDown, Clock, Shield,
  ArrowRight, Stethoscope, Syringe, Heart, Award, Users, Microscope,
  Activity, AlertCircle, Zap
} from "lucide-react";
import { C, FONT, SectionBadge, FULL_SERVICES } from "../shared";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Prise de rendez-vous",
    desc: "En ligne, par téléphone ou directement à l'accueil. Confirmation par email sous 2h ouvrées avec rappel 24h avant.",
    icon: <Calendar size={22} color={C.accent} />,
  },
  {
    step: "02",
    title: "Accueil & anamnèse",
    desc: "Votre vétérinaire prend 5 à 10 minutes pour recueillir l'historique médical complet, les habitudes alimentaires et les symptômes observés.",
    icon: <Users size={22} color={C.accent} />,
  },
  {
    step: "03",
    title: "Examen clinique",
    desc: "Examen systématique : auscultation cardiaque et pulmonaire, palpation abdominale, examen buccal, cutané, oculaire et locomoteur.",
    icon: <Stethoscope size={22} color={C.accent} />,
  },
  {
    step: "04",
    title: "Examens complémentaires",
    desc: "Si nécessaire : prises de sang (résultat en 45 min), radiographie numérique, échographie ou endoscopie au sein même de la clinique.",
    icon: <Microscope size={22} color={C.accent} />,
  },
  {
    step: "05",
    title: "Diagnostic & plan de soin",
    desc: "Diagnostic expliqué clairement avec options thérapeutiques chiffrées. Devis gratuit et consentement signé avant tout acte chirurgical.",
    icon: <Activity size={22} color={C.accent} />,
  },
  {
    step: "06",
    title: "Suivi & compte-rendu",
    desc: "Compte-rendu digital remis en fin de consultation. Suivi par email ou téléconsultation. Ordonnances numérisées accessible dans votre espace client.",
    icon: <Shield size={22} color={C.accent} />,
  },
];

const EQUIPMENT = [
  {
    category: "Imagerie & diagnostic",
    icon: <Microscope size={20} color={C.accent} />,
    items: [
      "Radiographie numérique haute résolution",
      "Échographie abdominale temps réel",
      "Échocardiographie Doppler couleur",
      "Endoscopie souple et rigide",
      "Otoscopie vidéo numérique",
      "Ophtalmoscope indirect binoculaire",
    ],
  },
  {
    category: "Bloc opératoire",
    icon: <Activity size={20} color={C.accent} />,
    items: [
      "Table opératoire chauffante",
      "Monitoring multiparamétrique",
      "Respirateur vétérinaire dédié",
      "Bistouri électrique bipolaire",
      "Aspiration chirurgicale",
      "Salle de réveil soins intensifs",
    ],
  },
  {
    category: "Laboratoire embarqué",
    icon: <Zap size={20} color={C.accent} />,
    items: [
      "Hématologie (NFS, formule)",
      "Biochimie sanguine complète",
      "Coprologie & parasitologie",
      "Urinalyse & sédiment urinaire",
      "Cytologie & bactériologie",
      "Tests rapides (FIV, FeLV, parvovirus)",
    ],
  },
  {
    category: "Dentisterie & chirurgie buccale",
    icon: <Award size={20} color={C.accent} />,
    items: [
      "Détartrage ultrasonique",
      "Radiographie dentaire numérique",
      "Polissage corona-radiculaire",
      "Extraction sous anesthésie générale",
      "Traitement parodontal avancé",
      "Chirurgie endodontique",
    ],
  },
];

const SPECIALTIES_DETAIL = [
  {
    id: "chirurgie",
    icon: <Syringe size={28} color={C.accent} />,
    title: "Chirurgie vétérinaire",
    price: "Sur devis (estimatif dès 180 €)",
    tag: "Spécialisé",
    color: C.accent,
    summary: "Notre bloc opératoire est équipé aux normes hospitalières : monitoring cardiaque continu, respirateur, bistouri électrique, salle de réveil soins intensifs. Chaque animal est veillé de l'induction jusqu'à son réveil complet.",
    indications: [
      "Stérilisation chienne / chatte / lapine",
      "Castration chien / chat",
      "Chirurgie des tissus mous (rate, intestin, estomac)",
      "Chirurgie orthopédique (fractures, LCC)",
      "Exérèse de tumeurs cutanées et sous-cutanées",
      "Chirurgie urologique (urétrostomie, cystotomie)",
    ],
    process: "Le propriétaire est contacté dès la sortie de bloc. Un devis détaillé est fourni avant tout acte. La facturation inclut anesthésie, monitoring, matériel et suivi post-opératoire à J3 et J10.",
    duration: "45 min à 3h selon l'acte",
    recovery: "1 à 5 jours d'hospitalisation possible",
  },
  {
    id: "cardiologie",
    icon: <Heart size={28} color={C.accent} />,
    title: "Cardiologie vétérinaire",
    price: "À partir de 90 €",
    tag: "Expert",
    color: "#4a7aa0",
    summary: "Dr. Pierre Leroy, DES cardiologie vétérinaire (Paris-Alfort), réalise les examens cardiologiques les plus avancés disponibles en Nouvelle-Aquitaine. Prise en charge des pathologies congénitales et acquises chez le chien, le chat et les NAC.",
    indications: [
      "Bilan cardiologique pré-opératoire",
      "Souffle cardiaque détecté (stades A à D)",
      "Insuffisance mitrale et tricuspide",
      "Cardiomyopathie dilatée (Dobermann, Boxer)",
      "Cardiomyopathie restrictive et HCM féline",
      "Hypertension artérielle systémique",
    ],
    process: "Consultation de 45 min incluant l'échocardiographie. Compte-rendu PDF illustré remis le jour même. Suivi téléphonique à 3 et 6 mois. Collaboration avec les cardiologues humains pour les cas complexes.",
    duration: "45 min",
    recovery: "Traitement médical ambulatoire",
  },
  {
    id: "dermatologie",
    icon: <Award size={28} color={C.accent} />,
    title: "Dermatologie & allergologie",
    price: "À partir de 65 €",
    tag: "Spécialisé",
    color: "#7a5ea0",
    summary: "Les dermatoses représentent 25 % des motifs de consultation vétérinaire. Notre protocole dermato inclut anamnèse détaillée, tests d'allergènes, biopsies cutanées et suivi thérapeutique à long terme.",
    indications: [
      "Prurit chronique (allergie alimentaire ou atopique)",
      "Pyodermite superficielle et profonde",
      "Dermatite atopique canine et féline",
      "Gale sarcoptique et démodécie",
      "Teigne (Microsporum canis, Trichophyton)",
      "Dermatoses hormonales (hypothyroïdie, Cushing)",
    ],
    process: "Bilan complet à la première consultation : raclages cutanés, trichoexamen, cytologie. Le régime d'exclusion alimentaire dure 8 semaines et est supervisé par notre vétérinaire nutritionniste.",
    duration: "40–60 min",
    recovery: "Traitement ambulatoire, suivi mensuel",
  },
  {
    id: "urgences",
    icon: <AlertCircle size={28} color={C.sand} />,
    title: "Urgences 24h/7j",
    price: "Supplément urgence : 35 € (nuit / WE)",
    tag: "Urgent",
    color: "#dc2626",
    summary: "Un vétérinaire urgentiste est d'astreinte toutes les nuits et chaque week-end. La salle de triage est opérationnelle en permanence. Les cas graves sont stabilisés puis transférés en soins intensifs ou vers un CHV partenaire si nécessaire.",
    indications: [
      "Intoxication (chocolat, raisin, médicaments)",
      "Traumatisme (choc, fracture, plaie ouverte)",
      "Détresse respiratoire aiguë",
      "Abdomen aigu (torsion d'estomac, obstruction)",
      "Choc anaphylactique",
      "Difficultés de mise bas (dystocie)",
    ],
    process: "Appelez notre ligne urgences avant de vous déplacer. Le vétérinaire de garde vous guidera par téléphone et préparera l'accueil. En cas de choc, ne donnez rien à manger/boire à l'animal.",
    duration: "Variable",
    recovery: "Hospitalisation 24h si nécessaire",
  },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────
function ServicesHero() {
  return (
    <section
      style={{
        padding: "80px 80px 60px",
        background: `linear-gradient(140deg, ${C.bg} 0%, ${C.accentLight} 100%)`,
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <SectionBadge label="Tous nos services" />
        <h1
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: -1.5,
            marginBottom: 18,
          }}
        >
          Soins complets pour chaque animal
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto 36px" }}>
          De la consultation de routine à la chirurgie spécialisée — notre plateau technique est au
          service de vos compagnons. Tarifs transparents, devis gratuit avant tout acte.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              whileHover={{ background: C.accentDark, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Calendar size={16} /> Prendre RDV
            </motion.button>
          </Link>
          <Link href="/templates/impact-32/contact" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.white,
                color: C.accent,
                border: `2px solid ${C.accent}`,
                borderRadius: 10,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Urgences 24h
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Services Grid ─────────────────────────────────────────────────────────────
function ServicesGrid() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 80px 60px", background: C.bg, fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 32, maxWidth: 1200, margin: "0 auto" }}>
        {FULL_SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: "36px 32px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: C.accentLight,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.icon}
              </div>
              <span
                style={{
                  background: C.bgSection,
                  color: C.accent,
                  borderRadius: 20,
                  padding: "5px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  border: `1px solid ${C.border}`,
                }}
              >
                {s.price}
              </span>
            </div>
            <h3 style={{ fontSize: 21, fontWeight: 800, color: C.text, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: 20 }}>{s.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {s.details.map((d) => (
                <li key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.text }}>
                  <CheckCircle size={14} color={C.accent} /> {d}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Process Steps ─────────────────────────────────────────────────────────────
function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 80px",
        background: C.bgSection,
        fontFamily: FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <SectionBadge label="Notre processus" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Une consultation, étape par étape
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          De la prise de rendez-vous au suivi post-consultation, chaque étape est pensée pour la sérénité de votre animal et la vôtre.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          gap: 28,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {PROCESS_STEPS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 36 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: C.white,
              borderRadius: 18,
              padding: "32px 28px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              position: "relative",
            }}
          >
            {/* Step number */}
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                fontSize: 36,
                fontWeight: 900,
                color: C.accentLight,
                lineHeight: 1,
                letterSpacing: -2,
              }}
            >
              {step.step}
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                background: C.accentLight,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              {step.icon}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 10 }}>{step.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Specialties Detail (accordion) ───────────────────────────────────────────
function SpecialtiesDetail() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<string | null>("chirurgie");

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 80px",
        background: C.bg,
        fontFamily: FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="Spécialités" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Nos spécialités en détail
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto" }}>
          Protocoles, indications, tarifs indicatifs et informations pratiques pour chaque spécialité.
        </p>
      </motion.div>

      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {SPECIALTIES_DETAIL.map((sp, i) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              background: C.white,
              borderRadius: 18,
              border: `1.5px solid ${open === sp.id ? sp.color : C.border}`,
              overflow: "hidden",
              transition: "border-color 0.2s",
              boxShadow: open === sp.id ? C.shadowLg : C.shadow,
            }}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setOpen(open === sp.id ? null : sp.id)}
              style={{
                width: "100%",
                padding: "24px 28px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                textAlign: "left" as const,
                fontFamily: FONT,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: open === sp.id ? sp.color + "1a" : C.bgSection,
                    borderRadius: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  {sp.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{sp.title}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{sp.price}</div>
                </div>
              </div>
              <motion.div animate={{ rotate: open === sp.id ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown size={22} color={open === sp.id ? sp.color : C.textMuted} />
              </motion.div>
            </button>

            {/* Body */}
            <AnimatePresence initial={false}>
              {open === sp.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 28px 32px" }}>
                    {/* Summary */}
                    <p
                      style={{
                        fontSize: 15,
                        color: C.textMuted,
                        lineHeight: 1.75,
                        marginBottom: 28,
                        paddingBottom: 24,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {sp.summary}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
                      {/* Indications */}
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 14, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
                          Indications
                        </h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                          {sp.indications.map((ind) => (
                            <li
                              key={ind}
                              style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: C.text, lineHeight: 1.45 }}
                            >
                              <CheckCircle size={13} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                              {ind}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practical info */}
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 14, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
                          Informations pratiques
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div
                            style={{
                              background: C.bgSection,
                              borderRadius: 10,
                              padding: "12px 16px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <Clock size={14} color={C.accent} style={{ marginTop: 1, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 2 }}>Durée</div>
                              <div style={{ fontSize: 14, color: C.text }}>{sp.duration}</div>
                            </div>
                          </div>
                          <div
                            style={{
                              background: C.bgSection,
                              borderRadius: 10,
                              padding: "12px 16px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <Shield size={14} color={C.accent} style={{ marginTop: 1, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 2 }}>Récupération</div>
                              <div style={{ fontSize: 14, color: C.text }}>{sp.recovery}</div>
                            </div>
                          </div>
                          <div
                            style={{
                              background: C.bgSection,
                              borderRadius: 10,
                              padding: "12px 16px",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Processus</div>
                            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{sp.process}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
                      <motion.button
                        type="button"
                        whileHover={{ background: C.accentDark, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          background: C.accent,
                          color: C.white,
                          border: "none",
                          borderRadius: 10,
                          padding: "12px 24px",
                          fontWeight: 800,
                          fontSize: 14,
                          cursor: "pointer",
                          fontFamily: FONT,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Calendar size={15} /> Prendre rendez-vous
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Equipment Section ─────────────────────────────────────────────────────────
function EquipmentSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 80px",
        background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`,
        fontFamily: FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            color: C.white,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase" as const,
            letterSpacing: 0.8,
          }}
        >
          Équipements
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            color: C.white,
            letterSpacing: -1,
            marginBottom: 14,
          }}
        >
          Un plateau technique complet
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", maxWidth: 520, margin: "0 auto" }}>
          Nos équipements répondent aux standards des centres hospitaliers vétérinaires universitaires.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: 24,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {EQUIPMENT.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 36 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 18,
              padding: "28px 24px",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(6px)",
            }}
          >
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
                  width: 40,
                  height: 40,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cat.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: C.white }}>{cat.category}</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              {cat.items.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  <CheckCircle size={12} color="rgba(255,255,255,0.6)" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Insurance Partners ─────────────────────────────────────────────────────────
function InsuranceSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const insurers = [
    { name: "Agria", desc: "Leader européen", emoji: "🏆" },
    { name: "Santévet", desc: "Remboursement 48h", emoji: "⚡" },
    { name: "Assur O'Poil", desc: "Formules modulables", emoji: "🛡️" },
    { name: "April", desc: "Sans exclusion de race", emoji: "✅" },
    { name: "AXA Animaux", desc: "Tiers-payant disponible", emoji: "🤝" },
  ];

  return (
    <section ref={ref} style={{ padding: "80px 80px 100px", background: C.bgSection, fontFamily: FONT }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 52 }}
      >
        <SectionBadge label="Assurances" />
        <h2 style={{ fontSize: "clamp(24px, 2.5vw, 38px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 12 }}>
          Partenaires assurance animaux
        </h2>
        <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>
          Nous émettons les factures dans le format requis par vos assureurs. Le tiers-payant est disponible avec certains partenaires.
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: 900,
          margin: "0 auto 48px",
        }}
      >
        {insurers.map((ins, i) => (
          <motion.div
            key={ins.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -3, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 14,
              padding: "18px 22px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 160,
            }}
          >
            <span style={{ fontSize: 22 }}>{ins.emoji}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{ins.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{ins.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/pricing" style={{ textDecoration: "none" }}>
          <motion.button
            type="button"
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 10,
              padding: "16px 40px",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              fontFamily: FONT,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Calendar size={18} /> Voir les tarifs & prendre RDV <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ProcessSection />
      <SpecialtiesDetail />
      <EquipmentSection />
      <InsuranceSection />
    </>
  );
}
