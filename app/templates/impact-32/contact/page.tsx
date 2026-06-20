"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle, Shield,
  Send, ChevronDown, Calendar, Users, Heart, ArrowRight
} from "lucide-react";
import { C, FONT, SectionBadge } from "../shared";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const EMERGENCY_STEPS = [
  {
    step: "1",
    title: "Restez calme",
    desc: "Votre stress se transmet à l'animal. Parlez-lui doucement, évitez les gestes brusques.",
    icon: <Heart size={18} color={C.white} />,
    color: "#dc2626",
  },
  {
    step: "2",
    title: "Appelez en premier",
    desc: "Ne vous déplacez PAS avant d'appeler. Le vétérinaire de garde vous guidera et préparera l'accueil.",
    icon: <Phone size={18} color={C.white} />,
    color: "#dc2626",
  },
  {
    step: "3",
    title: "Sécurisez l'animal",
    desc: "Pour les chiens blessés : museler même un chien doux (la douleur peut entraîner des morsures). Pour les chats : boîte de transport fermée.",
    icon: <Shield size={18} color={C.white} />,
    color: "#dc2626",
  },
  {
    step: "4",
    title: "Ne donnez rien",
    desc: "N'administrez aucun médicament humain avant d'avoir parlé au vétérinaire. Certains (ibuprofène, paracétamol) sont mortels pour les animaux.",
    icon: <AlertCircle size={18} color={C.white} />,
    color: "#dc2626",
  },
];

const EMERGENCY_SIGNS = [
  { label: "Difficultés respiratoires", urgent: true },
  { label: "Convulsions", urgent: true },
  { label: "Perte de connaissance", urgent: true },
  { label: "Sang dans les urines / selles", urgent: true },
  { label: "Abdomen ballonné / douloureux", urgent: true },
  { label: "Ingestion de toxique", urgent: true },
  { label: "Traumatisme (accident, chute)", urgent: true },
  { label: "Vomissements répétés (>3 en 2h)", urgent: false },
  { label: "Refus de manger >48h", urgent: false },
  { label: "Boiterie soudaine sévère", urgent: false },
  { label: "Œil rouge / fermé brutalement", urgent: false },
  { label: "Abcès ou plaie ouverte", urgent: false },
];

const GUARD_TEAM = [
  {
    name: "Dr. Lucas Martin",
    role: "Urgentiste — nuits & week-ends",
    specialty: "Médecine d'urgence & réanimation",
    initials: "LM",
    color: "#a05e5e",
    schedule: "Lun–Dim, 20h–8h",
  },
  {
    name: "Dr. Marie Fontaine",
    role: "Vétérinaire référente",
    specialty: "Chirurgie douce & médecine interne",
    initials: "MF",
    color: C.accent,
    schedule: "Sam–Dim, 8h–20h",
  },
  {
    name: "Dr. Nadia Sall",
    role: "Vétérinaire NAC & exotiques",
    specialty: "Lapins, oiseaux, reptiles, rongeurs",
    initials: "NS",
    color: "#7a5ea0",
    schedule: "Lun–Ven, 9h–18h",
  },
];

const EMERGENCY_FAQ = [
  {
    q: "Mon chien a mangé du chocolat — c'est une urgence ?",
    a: "Oui, surtout le chocolat noir et le cacao. La théobromine est toxique pour les chiens. Calculez le ratio : 50 mg/kg peut provoquer des convulsions. Si votre chien pèse 10 kg et a ingéré >20g de chocolat noir, appelez immédiatement. Plus tôt vous appelez, plus efficace est le traitement (vomissement provoqué dans les 2h).",
  },
  {
    q: "Mon chat ne mange plus depuis 24h — je viens en urgence ?",
    a: "Un chat qui n'a pas mangé depuis 24h doit être surveillé, et depuis 48h il faut consulter en urgence (lipidose hépatique possible). Si en plus il ne boit pas, a des vomissements ou est léthargique, appelez notre ligne urgences immédiatement.",
  },
  {
    q: "Mon lapin est en position de détresse — que faire ?",
    a: "Les lapins sont fragiles et ne montrent pas leur douleur. Un lapin en position 'pain croissant', qui grince des dents ou qui est prostré est en situation d'urgence. Les crises de GI stasis (arrêt du transit) peuvent être fatales en 12-24h. Appelez immédiatement.",
  },
  {
    q: "Y a-t-il un surcoût pour les consultations de nuit ?",
    a: "Oui, un supplément urgence de 35 € est appliqué pour les consultations entre 20h et 8h et les week-ends & jours fériés. Ce supplément couvre le déplacement du vétérinaire de garde et la mise en place de la salle de triage. Le reste de la facture (actes, médicaments) est au tarif habituel.",
  },
  {
    q: "Pouvez-vous venir à domicile en urgence ?",
    a: "Non, PawCare Clinic ne propose pas de consultations à domicile. En revanche, notre vétérinaire de garde vous guidera par téléphone pour stabiliser l'animal pendant le trajet. Pour les cas très graves, nous coordonnons avec les CHV (centres hospitaliers vétérinaires) partenaires qui ont des services mobiles.",
  },
  {
    q: "J'ai un oiseau en détresse respiratoire — vous le prenez en charge ?",
    a: "Oui. Dr. Nadia Sall est spécialisée aviculture. Un oiseau en détresse respiratoire (queue qui pompe, bec ouvert, position de pingouin) est une urgence extrême — leur métabolisme est très rapide. Appelez avant de vous déplacer car nous préparerons une couveuse chauffante et l'oxygène.",
  },
];

const CONTACT_INFO = [
  {
    icon: <Phone size={20} color={C.accent} />,
    title: "Téléphone standard",
    details: ["Lun–Sam : 8h–20h", "+33 (0)5 56 00 00 00"],
    urgent: false,
  },
  {
    icon: <AlertCircle size={20} color="#dc2626" />,
    title: "Ligne urgences 24h/7j",
    details: ["24h/24 — 7j/7", "+33 (0)5 56 00 00 01"],
    urgent: true,
  },
  {
    icon: <Mail size={20} color={C.accent} />,
    title: "Email",
    details: ["Réponse sous 4h ouvrées", "contact@pawcare-bordeaux.fr"],
    urgent: false,
  },
  {
    icon: <MapPin size={20} color={C.accent} />,
    title: "Adresse",
    details: ["15 Rue des Platanes", "33000 Bordeaux"],
    urgent: false,
  },
];

const HOURS = [
  { day: "Lundi – Vendredi", hours: "8h00 – 20h00", open: true },
  { day: "Samedi", hours: "8h00 – 18h00", open: true },
  { day: "Dimanche & Jours fériés", hours: "Sur urgence uniquement", open: false },
  { day: "Urgences", hours: "24h/24 — 7j/7", open: true, urgent: true },
];

// ─── Contact Hero ─────────────────────────────────────────────────────────────
function ContactHero() {
  return (
    <section
      style={{
        padding: "80px 80px 60px",
        background: `linear-gradient(140deg, ${C.bg} 0%, ${C.accentLight} 100%)`,
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <SectionBadge label="Contact & Urgences" />
        <h1
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 800,
            color: C.text,
            letterSpacing: -1.5,
            marginBottom: 18,
          }}
        >
          Nous contacter
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 540, margin: "0 auto 36px" }}>
          Prise de rendez-vous, questions, ou urgences — notre équipe est disponible. En cas de
          détresse vitale de votre animal, appelez notre ligne urgences avant de vous déplacer.
        </p>

        {/* Emergency call strip */}
        <motion.a
          href="tel:+33556000001"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "#dc2626",
            color: C.white,
            borderRadius: 12,
            padding: "14px 28px",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 15,
            fontFamily: FONT,
            boxShadow: "0 8px 32px rgba(220,38,38,0.3)",
          }}
        >
          <AlertCircle size={18} />
          Urgences : +33 (0)5 56 00 00 01 — 24h/7j
        </motion.a>
      </div>
    </section>
  );
}

// ─── Contact Info + Map ────────────────────────────────────────────────────────
function ContactInfo() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ padding: "80px 80px", background: C.bg, fontFamily: FONT }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          maxWidth: 1100,
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {/* Contact cards */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            style={{ marginBottom: 36 }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 8 }}>
              Coordonnées
            </h2>
            <p style={{ fontSize: 15, color: C.textMuted }}>Toute l'équipe vous attend.</p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CONTACT_INFO.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  background: info.urgent ? "#fef2f2" : C.white,
                  borderRadius: 14,
                  padding: "18px 22px",
                  border: `1.5px solid ${info.urgent ? "#fca5a5" : C.border}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  boxShadow: C.shadow,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: info.urgent ? "#fee2e2" : C.accentLight,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: info.urgent ? "#dc2626" : C.text, marginBottom: 4 }}>
                    {info.title}
                  </div>
                  {info.details.map((d) => (
                    <div key={d} style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.55 }}>{d}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 28,
              background: C.white,
              borderRadius: 16,
              padding: "24px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Clock size={16} color={C.accent} />
              <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Horaires d'ouverture</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {HOURS.map((h) => (
                <div
                  key={h.day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{h.day}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: h.urgent ? "#dc2626" : h.open ? C.accent : C.textMuted,
                      background: h.urgent ? "#fee2e2" : h.open ? C.accentLight : C.bgSection,
                      borderRadius: 8,
                      padding: "3px 10px",
                    }}
                  >
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Map embed */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 8 }}>
            Comment nous trouver
          </h2>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 24 }}>
            15 Rue des Platanes, 33000 Bordeaux — Tram B arrêt Pellegrin (3 min à pied). Parking gratuit sur place.
          </p>

          {/* Map placeholder (no real embed to avoid external dependencies) */}
          <div
            style={{
              width: "100%",
              height: 320,
              borderRadius: 18,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              background: C.bgSection,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            {/* Stylized map visual */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  linear-gradient(${C.border} 1px, transparent 1px),
                  linear-gradient(90deg, ${C.border} 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                opacity: 0.4,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: C.accent,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 20px rgba(45,106,79,0.4)`,
                }}
              >
                <MapPin size={24} color={C.white} />
              </div>
              <div
                style={{
                  background: C.white,
                  borderRadius: 10,
                  padding: "10px 18px",
                  boxShadow: C.shadowLg,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>PawCare Clinic</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>15 Rue des Platanes, Bordeaux</div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: <MapPin size={14} />, text: "Tram B — Pellegrin (3 min)" },
              { icon: <Users size={14} />, text: "Parking gratuit 20 places" },
              { icon: <Shield size={14} />, text: "Accès PMR" },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: C.textMuted,
                  boxShadow: C.shadow,
                }}
              >
                <span style={{ color: C.accent }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Appointment Form ─────────────────────────────────────────────────────────
function AppointmentForm() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  type FormData = {
    ownerName: string;
    email: string;
    phone: string;
    petName: string;
    species: string;
    petAge: string;
    date: string;
    time: string;
    urgency: boolean;
    reason: string;
    insurer: string;
  };

  const [form, setForm] = useState<FormData>({
    ownerName: "",
    email: "",
    phone: "",
    petName: "",
    species: "",
    petAge: "",
    date: "",
    time: "",
    urgency: false,
    reason: "",
    insurer: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    border: `1.5px solid ${C.border}`,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: FONT,
    color: C.text,
    background: C.white,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: C.text,
    display: "block",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  };

  return (
    <section
      ref={ref}
      style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 56 }}
      >
        <SectionBadge label="Prise de rendez-vous" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1.5, marginBottom: 16 }}>
          Réserver une consultation
        </h2>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          Formulaire complet avec type d'animal, urgence et assureur. Confirmation sous 2h ouvrées.
        </p>
      </motion.div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: C.white,
              borderRadius: 24,
              padding: "48px 44px",
              boxShadow: C.shadowLg,
              border: `1px solid ${C.border}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                background: C.accentLight,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 28px",
              }}
            >
              <CheckCircle size={40} color={C.accent} />
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.text, marginBottom: 16 }}>Demande envoyée !</h2>
            <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 12 }}>
              Votre demande pour{" "}
              <strong style={{ color: C.text }}>{form.petName}</strong> ({form.species}) a bien été reçue.
              {form.urgency && (
                <span style={{ color: "#dc2626", fontWeight: 700 }}>
                  {" "}Marquée comme urgente — traitement prioritaire.
                </span>
              )}
            </p>
            <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 32 }}>
              Notre équipe vous confirme votre créneau à{" "}
              <strong>{form.email}</strong> dans les 2h ouvrées.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 10,
                padding: "13px 28px",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Nouveau rendez-vous
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            onSubmit={handleSubmit}
            style={{
              background: C.white,
              borderRadius: 24,
              padding: "48px 44px",
              boxShadow: C.shadowLg,
              border: `1px solid ${C.border}`,
            }}
          >
            {/* Urgency toggle */}
            <div
              style={{
                background: form.urgency ? "#fef2f2" : C.bgSection,
                borderRadius: 14,
                padding: "16px 20px",
                marginBottom: 32,
                border: `1.5px solid ${form.urgency ? "#fca5a5" : C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setForm((p) => ({ ...p, urgency: !p.urgency }))}
            >
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: form.urgency ? "#dc2626" : C.border,
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: form.urgency ? 23 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: C.white,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    color: form.urgency ? "#dc2626" : C.text,
                  }}
                >
                  {form.urgency ? "⚠️ Consultation urgente" : "Consultation standard"}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  {form.urgency
                    ? "Traitement prioritaire — nous vous rappelons sous 30 min"
                    : "Activer si votre animal nécessite une attention rapide"}
                </div>
              </div>
            </div>

            {/* Owner info */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 20 }}>
                Vos coordonnées
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle} htmlFor="ownerName">Nom complet</label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={form.ownerName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jean@email.fr"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Pet info */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 20 }}>
                Votre animal
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle} htmlFor="petName">Nom de l'animal</label>
                  <input
                    id="petName"
                    name="petName"
                    type="text"
                    required
                    placeholder="Rex"
                    value={form.petName}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="species">Espèce</label>
                  <select
                    id="species"
                    name="species"
                    required
                    value={form.species}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Espèce…</option>
                    <option value="Chien">Chien</option>
                    <option value="Chat">Chat</option>
                    <option value="Lapin">Lapin / Rongeur</option>
                    <option value="Oiseau">Oiseau</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Poisson">Poisson</option>
                    <option value="Autre">Autre NAC</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="petAge">Âge approximatif</label>
                  <select
                    id="petAge"
                    name="petAge"
                    value={form.petAge}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Âge…</option>
                    <option value="Moins de 1 an">Moins de 1 an</option>
                    <option value="1–3 ans">1 – 3 ans</option>
                    <option value="4–7 ans">4 – 7 ans</option>
                    <option value="8–12 ans">8 – 12 ans</option>
                    <option value="Plus de 12 ans">Plus de 12 ans</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="insurer">Assureur (optionnel)</label>
                <select
                  id="insurer"
                  name="insurer"
                  value={form.insurer}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Pas d'assurance / Non renseigné</option>
                  <option value="Agria">Agria</option>
                  <option value="Santévet">Santévet</option>
                  <option value="Assur O'Poil">Assur O'Poil</option>
                  <option value="April">April</option>
                  <option value="AXA Animaux">AXA Animaux</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Date & time */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 20 }}>
                Créneau souhaité
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle} htmlFor="date">Date souhaitée</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    style={inputStyle}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="time">Heure préférée</label>
                  <select
                    id="time"
                    name="time"
                    required
                    value={form.time}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="">Choisir un créneau…</option>
                    {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
                      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="reason">Motif de la consultation</label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  placeholder="Décrivez brièvement le motif de votre visite, les symptômes observés et leur durée…"
                  value={form.reason}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
              </div>
            </div>

            {/* GDPR */}
            <div
              style={{
                background: C.bgSection,
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 28,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <Shield size={16} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.55 }}>
                Vos données sont utilisées uniquement pour la gestion de votre rendez-vous. Aucune
                donnée n'est partagée avec des tiers. Conformément au RGPD, vous pouvez exercer vos
                droits à contact@pawcare-bordeaux.fr
              </p>
            </div>

            <motion.button
              type="submit"
              whileHover={{ background: C.accentDark, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                background: form.urgency ? "#dc2626" : C.accent,
                color: C.white,
                border: "none",
                borderRadius: 12,
                padding: "16px",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "background 0.2s",
              }}
            >
              {form.urgency ? (
                <><AlertCircle size={18} /> Envoyer ma demande urgente</>
              ) : (
                <><Send size={18} /> Envoyer ma demande de RDV</>
              )}
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

// ─── Emergency Guide ────────────────────────────────────────────────────────────
function EmergencyGuide() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

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
        <div
          style={{
            display: "inline-block",
            background: "#fee2e2",
            color: "#dc2626",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textTransform: "uppercase" as const,
            letterSpacing: 0.8,
          }}
        >
          Urgences
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Que faire en cas d'urgence ?
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 520, margin: "0 auto" }}>
          Gardez votre calme. Ces 4 étapes peuvent sauver la vie de votre animal avant d'arriver à la clinique.
        </p>
      </motion.div>

      {/* Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          maxWidth: 1100,
          margin: "0 auto 64px",
        }}
      >
        {EMERGENCY_STEPS.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: C.white,
              borderRadius: 18,
              padding: "28px 24px",
              border: `1px solid #fca5a5`,
              boxShadow: "0 4px 20px rgba(220,38,38,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#dc2626",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#fca5a5",
                  lineHeight: 1,
                }}
              >
                {step.step}
              </span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 10 }}>{step.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Signs to watch */}
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 24, textAlign: "center" }}>
          Signes nécessitant une consultation
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {EMERGENCY_SIGNS.map((sign) => (
            <div
              key={sign.label}
              style={{
                background: sign.urgent ? "#fef2f2" : C.white,
                borderRadius: 10,
                padding: "12px 16px",
                border: `1px solid ${sign.urgent ? "#fca5a5" : C.border}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                color: C.text,
              }}
            >
              <AlertCircle
                size={14}
                color={sign.urgent ? "#dc2626" : C.textMuted}
              />
              <span style={{ fontWeight: sign.urgent ? 700 : 500 }}>{sign.label}</span>
              {sign.urgent && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#dc2626",
                    color: C.white,
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  VITAL
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Guard Team ────────────────────────────────────────────────────────────────
function GuardTeam() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "80px 80px 100px",
        background: C.bgSection,
        fontFamily: FONT,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 56 }}
      >
        <SectionBadge label="Équipe de garde" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, color: C.text, letterSpacing: -1, marginBottom: 14 }}>
          Des vétérinaires disponibles en permanence
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>
          Votre animal ne choisit pas son heure. Notre équipe de garde non plus.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto 48px",
        }}
      >
        {GUARD_TEAM.map((doc, i) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -5, boxShadow: C.shadowLg }}
            style={{
              background: C.white,
              borderRadius: 20,
              padding: "28px 24px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: doc.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: 22,
                fontWeight: 800,
                color: C.white,
                letterSpacing: 1,
              }}
            >
              {doc.initials}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 4 }}>{doc.name}</h3>
            <div style={{ fontSize: 13, fontWeight: 700, color: doc.color, marginBottom: 8 }}>{doc.role}</div>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, lineHeight: 1.55 }}>{doc.specialty}</p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: C.bgSection,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: C.textMuted,
              }}
            >
              <Clock size={11} />
              {doc.schedule}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link href="/templates/impact-32/equipe" style={{ textDecoration: "none" }}>
          <motion.button
            type="button"
            whileHover={{ background: C.accentLight, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              color: C.accent,
              border: `2px solid ${C.accent}`,
              borderRadius: 10,
              padding: "13px 32px",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: FONT,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Voir toute l'équipe <ArrowRight size={16} />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

// ─── Emergency FAQ ─────────────────────────────────────────────────────────────
function EmergencyFAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <SectionBadge label="FAQ Urgences" />
        <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: C.text, letterSpacing: -1 }}>
          Questions sur les urgences
        </h2>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 460, margin: "16px auto 0" }}>
          Situations courantes expliquées par nos vétérinaires urgentistes.
        </p>
      </motion.div>

      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {EMERGENCY_FAQ.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              background: C.white,
              borderRadius: 14,
              border: `1px solid ${open === i ? C.accent : C.border}`,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                padding: "20px 24px",
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
              <span style={{ fontWeight: 700, fontSize: 15, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
                <ChevronDown size={20} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>
                    {faq.a}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <AppointmentForm />
      <EmergencyGuide />
      <GuardTeam />
      <EmergencyFAQ />
    </>
  );
}
