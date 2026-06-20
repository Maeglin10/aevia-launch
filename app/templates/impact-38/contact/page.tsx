"use client";

import React, { useState } from "react";
import { MapPin, Clock, Mail, Phone, ChevronDown, Users, Coffee, Calendar, CheckCircle, Star, ArrowRight, Truck, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { C, SERIF, SANS, SectionReveal, PageHeader, FAQS } from "../shared";

// ─── Page-level constants ─────────────────────────────────────────────────────

const CONTACT_SUBJECTS = [
  "Question sur mon abonnement",
  "Commande en gros / B2B",
  "Atelier dégustation",
  "Visite de la torréfaction",
  "Partenariat restauration / hôtellerie",
  "Question sur un café spécifique",
  "Problème de livraison",
  "Autre",
];

const HOURS = [
  { day: "Lundi – Vendredi", time: "7h – 19h" },
  { day: "Samedi", time: "8h – 18h" },
  { day: "Dimanche", time: "9h – 14h" },
];

const ROASTING_DAYS = [
  { day: "Mardi", time: "6h – 12h", lots: "Lots filtre & single origin" },
  { day: "Vendredi", time: "6h – 12h", lots: "Lots espresso & blends" },
];

const B2B_SECTORS = [
  { icon: Coffee, label: "Cafés & Restaurants", desc: "Prix grossiste dès 5 kg/mois. Grain entier ou moulu sur commande." },
  { icon: Star, label: "Hôtellerie", desc: "Packages chambre & restaurant. Marque blanche disponible." },
  { icon: Users, label: "Bureaux & Co-working", desc: "Abonnement machine incluse. Livraison hebdomadaire." },
  { icon: Truck, label: "Distribution", desc: "Programme revendeur pour épiceries fines et boutiques spécialisées." },
];

const WORKSHOP_CONTACT_OPTIONS = [
  {
    title: "Initiation dégustation",
    duration: "2h",
    price: "45€/pers",
    minGroup: 4,
    maxGroup: 8,
    desc: "Découverte du cupping professionnel, arômes, textures, vocabulaire sensoriel.",
    available: true,
  },
  {
    title: "Barista pour un jour",
    duration: "3h",
    price: "75€/pers",
    minGroup: 2,
    maxGroup: 4,
    desc: "Extraction espresso, mousse de lait, bases du latte art derrière le comptoir.",
    available: true,
  },
  {
    title: "Torréfaction découverte",
    duration: "4h",
    price: "120€/pers",
    minGroup: 2,
    maxGroup: 3,
    desc: "Vous torréfiez votre propre lot et repartez avec 250g fraîchement sortis du tambour.",
    available: true,
  },
  {
    title: "Team building café",
    duration: "3h",
    price: "55€/pers",
    minGroup: 10,
    maxGroup: 20,
    desc: "Format entreprise : cupping, blind tasting, espresso challenge. Idéal pour les équipes.",
    available: false,
  },
];

const SUBSCRIPTION_FAQ = [
  {
    q: "Comment fonctionne la facturation de l'abonnement ?",
    a: "Votre abonnement est prélevé le 1er de chaque mois. Vous recevez une confirmation par email 3 jours avant chaque prélèvement. Vous pouvez modifier, suspendre ou annuler à tout moment depuis votre espace client, jusqu'à 48h avant le prélèvement.",
  },
  {
    q: "Puis-je choisir mes cafés chaque mois ?",
    a: "Sur les plans Amateur et Connaisseur, oui — vous pouvez indiquer vos préférences (profil aromatique, méthode de préparation, intensité) et notre torréfacteur sélectionne les lots les mieux adaptés. Pour le plan Découverte, la sélection est entièrement curative.",
  },
  {
    q: "Quand mon café est-il torréfié ?",
    a: "Nous torréfions à la commande, chaque mardi et vendredi. Votre café part en torréfaction dès confirmation du paiement. Il repose ensuite 5 à 14 jours selon le procédé (les naturels reposent plus longtemps), puis est expédié. Vous recevez un email de suivi à chaque étape.",
  },
  {
    q: "Comment modifier ma mouture en cours d'abonnement ?",
    a: "Depuis votre espace client, vous pouvez changer la mouture à tout moment — le changement est pris en compte dès le prochain cycle. Vous pouvez aussi nous écrire à contact@originroast.co et nous l'appliquons manuellement si vous avez un délai serré.",
  },
  {
    q: "Livrez-vous en dehors de France ?",
    a: "Oui, nous livrons dans 22 pays (Europe + Amérique du Nord). La livraison internationale est en DHL Express suivi (3–5 jours ouvrés). Des frais de livraison s'appliquent selon la destination — ils sont indiqués à la validation de la commande.",
  },
  {
    q: "Mon café arrive cassé ou manquant — que faire ?",
    a: "Photographiez le colis dès réception et envoyez-nous l'email dans les 48h à contact@originroast.co. Nous expédions un remplacement sous 72h sans frais supplémentaires. Les problèmes liés au transporteur sont couverts par notre assurance colis.",
  },
];

const TRUST_BADGES = [
  { icon: Award, label: "SCA Certified", desc: "Tous nos torréfacteurs sont certifiés Q-Grader" },
  { icon: Truck, label: "Livraison offerte", desc: "Dès 35€ d'achat en France métropolitaine" },
  { icon: CheckCircle, label: "Satisfaction 30j", desc: "Remboursement intégral si vous n'êtes pas satisfait" },
  { icon: Star, label: "4.9/5 moyen", desc: "Basé sur 847 avis vérifiés" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function ContactFAQItem({ faq, delay }: { faq: { q: string; a: string }; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          background: C.white,
          border: `1px solid ${open ? C.caramel : C.border}`,
          borderRadius: 10,
          padding: "18px 22px",
          cursor: "pointer",
          marginBottom: 8,
          transition: "border-color 0.2s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 15, color: C.espresso }}>{faq.q}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
            <ChevronDown size={17} color={C.caramel} />
          </motion.div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              style={{ fontFamily: SANS, fontSize: 14, color: C.textMuted, lineHeight: 1.75, overflow: "hidden" }}
            >
              {faq.a}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "b2b" | "workshop">("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: CONTACT_SUBJECTS[0],
    message: "",
    volume: "",
    workshopType: "",
    workshopDate: "",
    groupSize: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: `1px solid ${C.border}`,
    fontSize: 15,
    fontFamily: SANS,
    background: C.bg,
    color: C.text,
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: C.text,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 7,
  };

  return (
    <div style={{ background: C.bg }}>
      <PageHeader
        title="Contact & Commandes Pro"
        subtitle="Questions sur nos cafés, abonnements, ateliers ou partenariats B2B — nous répondons sous 24h ouvrées."
      />

      {/* ─── TRUST BADGES ────────────────────────────────────────────────── */}
      <div style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: "20px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {TRUST_BADGES.map((badge, i) => (
            <div key={badge.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <badge.icon size={17} color={C.caramel} />
              </div>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.espresso }}>{badge.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 300 }}>{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTACT GRID ───────────────────────────────────────────── */}
      <div style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "340px 1fr", gap: 60, alignItems: "start" }}>

          {/* LEFT: Info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionReveal>
              {/* Address */}
              <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={18} color={C.caramel} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso, margin: 0 }}>Torréfaction & Showroom</h3>
                </div>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, fontWeight: 300, marginBottom: 10 }}>
                  Valentin Milliand, SIREN 852 546 225<br />
                  RCS Bourg-en-Bresse<br />
                  Adresse communiquée sur rendez-vous.
                </p>
                <a href="mailto:contact@originroast.co" style={{ fontSize: 13, color: C.caramel, fontWeight: 600, textDecoration: "none" }}>
                  contact@originroast.co
                </a>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.05}>
              {/* Hours */}
              <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={18} color={C.caramel} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso, margin: 0 }}>Horaires d'accueil</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {HOURS.map((h) => (
                    <div key={h.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: C.text, fontWeight: 400 }}>{h.day}</span>
                      <span style={{ fontSize: 13, color: C.caramel, fontWeight: 700 }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              {/* Roasting calendar */}
              <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Coffee size={18} color={C.caramel} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso, margin: 0 }}>Jours de torréfaction</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {ROASTING_DAYS.map((d) => (
                    <div key={d.day} style={{ background: C.bgAlt, borderRadius: 8, padding: "12px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.espresso }}>{d.day}</span>
                        <span style={{ fontSize: 12, color: C.caramel, fontWeight: 600 }}>{d.time}</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 300 }}>{d.lots}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.textMuted, marginTop: 12, fontWeight: 300, lineHeight: 1.6 }}>
                  Visites de la torréfaction possibles sur rendez-vous les matins de torréfaction. Demandez-nous par email.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              {/* Contact direct */}
              <div style={{ background: C.white, borderRadius: 14, padding: 28, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: C.caramelLight, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={18} color={C.caramel} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: C.espresso, margin: 0 }}>Contact direct</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Email</div>
                    <a href="mailto:contact@originroast.co" style={{ fontSize: 14, color: C.caramel, fontWeight: 600, textDecoration: "none" }}>contact@originroast.co</a>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>B2B uniquement</div>
                    <a href="tel:+33600000000" style={{ fontSize: 14, color: C.textMuted, fontWeight: 400, textDecoration: "none" }}>+33 (0)6 00 00 00 00</a>
                  </div>
                  <div style={{ paddingTop: 10, borderTop: `1px solid ${C.borderLight}` }}>
                    <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 300, lineHeight: 1.6 }}>
                      Temps de réponse habituel : <strong style={{ color: C.espresso }}>moins de 4h</strong> en semaine.
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* RIGHT: Form with tabs */}
          <SectionReveal delay={0.1}>
            {!submitted ? (
              <div style={{ background: C.white, borderRadius: 16, padding: 44, border: `1px solid ${C.border}` }}>
                {/* Tab selector */}
                <div style={{ display: "flex", gap: 6, marginBottom: 32, background: C.bgAlt, borderRadius: 10, padding: 4 }}>
                  {([
                    { id: "general", label: "Message général" },
                    { id: "b2b", label: "Commande pro" },
                    { id: "workshop", label: "Atelier" },
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: SANS,
                        fontSize: 13,
                        fontWeight: 700,
                        background: activeTab === tab.id ? C.white : "transparent",
                        color: activeTab === tab.id ? C.espresso : C.textMuted,
                        boxShadow: activeTab === tab.id ? "0 1px 6px rgba(26,10,0,0.08)" : "none",
                        transition: "all 0.2s",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Common fields */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Prénom & Nom</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Sophie Martin"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                        placeholder="sophie@example.com"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Tab-specific fields */}
                  <AnimatePresence mode="wait">
                    {activeTab === "general" && (
                      <motion.div
                        key="general"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", flexDirection: "column", gap: 18 }}
                      >
                        <div>
                          <label style={labelStyle}>Sujet</label>
                          <select
                            value={formData.subject}
                            onChange={(e) => setFormData((f) => ({ ...f, subject: e.target.value }))}
                            style={inputStyle}
                          >
                            {CONTACT_SUBJECTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Message</label>
                          <textarea
                            required
                            rows={6}
                            value={formData.message}
                            onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                            placeholder="Votre message..."
                            style={{ ...inputStyle, resize: "vertical" }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "b2b" && (
                      <motion.div
                        key="b2b"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", flexDirection: "column", gap: 18 }}
                      >
                        <div style={{ background: C.caramelLight, borderRadius: 10, padding: 16 }}>
                          <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.espresso, marginBottom: 6 }}>
                            Tarifs grossiste dès 5 kg/mois
                          </div>
                          <p style={{ fontSize: 13, color: C.textMuted, fontWeight: 300, lineHeight: 1.6 }}>
                            Remises de 10 à 25% selon le volume. Livraison hebdomadaire. Facturation mensuelle.
                          </p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label style={labelStyle}>Entreprise / Établissement</label>
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData((f) => ({ ...f, company: e.target.value }))}
                              placeholder="Restaurant La Table"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Téléphone</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                              placeholder="+33 6 12 34 56 78"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Secteur d'activité</label>
                          <select
                            style={inputStyle}
                          >
                            {B2B_SECTORS.map((s) => (
                              <option key={s.label} value={s.label}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Volume mensuel estimé (kg)</label>
                          <select
                            value={formData.volume}
                            onChange={(e) => setFormData((f) => ({ ...f, volume: e.target.value }))}
                            style={inputStyle}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="5-10">5 – 10 kg/mois</option>
                            <option value="10-25">10 – 25 kg/mois</option>
                            <option value="25-50">25 – 50 kg/mois</option>
                            <option value="50+">50 kg/mois et plus</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Précisions sur votre besoin</label>
                          <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                            placeholder="Décrivez votre utilisation (espresso machine, filtre, cold brew), vos horaires de livraison souhaités, vos contraintes..."
                            style={{ ...inputStyle, resize: "vertical" }}
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                          {B2B_SECTORS.map((sector) => (
                            <div key={sector.label} style={{ background: C.bgAlt, borderRadius: 10, padding: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <div style={{ width: 32, height: 32, background: C.caramelLight, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <sector.icon size={15} color={C.caramel} />
                              </div>
                              <div>
                                <div style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: C.espresso, marginBottom: 3 }}>{sector.label}</div>
                                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 300, lineHeight: 1.5 }}>{sector.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "workshop" && (
                      <motion.div
                        key="workshop"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", flexDirection: "column", gap: 18 }}
                      >
                        <div>
                          <label style={labelStyle}>Type d'atelier souhaité</label>
                          <select
                            value={formData.workshopType}
                            onChange={(e) => setFormData((f) => ({ ...f, workshopType: e.target.value }))}
                            style={inputStyle}
                          >
                            <option value="">Sélectionner un atelier...</option>
                            {WORKSHOP_CONTACT_OPTIONS.map((w) => (
                              <option key={w.title} value={w.title} disabled={!w.available}>
                                {w.title} — {w.price} ({w.duration}){!w.available ? " — Complet" : ""}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Workshop cards */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {WORKSHOP_CONTACT_OPTIONS.map((w) => (
                            <div
                              key={w.title}
                              onClick={() => w.available && setFormData((f) => ({ ...f, workshopType: w.title }))}
                              style={{
                                background: formData.workshopType === w.title ? C.caramelLight : C.bgAlt,
                                border: `1px solid ${formData.workshopType === w.title ? C.caramel : C.borderLight}`,
                                borderRadius: 10,
                                padding: "14px 16px",
                                cursor: w.available ? "pointer" : "not-allowed",
                                opacity: w.available ? 1 : 0.5,
                                transition: "all 0.15s",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                  <div style={{ fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>
                                    {w.title}
                                    {!w.available && <span style={{ marginLeft: 8, fontSize: 10, background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: 10, fontFamily: SANS, fontWeight: 800 }}>Complet</span>}
                                  </div>
                                  <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 300, lineHeight: 1.5 }}>{w.desc}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                                  <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: C.caramel }}>{w.price}</div>
                                  <div style={{ fontSize: 11, color: C.textMuted }}>{w.duration}</div>
                                  <div style={{ fontSize: 11, color: C.textMuted }}>{w.minGroup}–{w.maxGroup} pers.</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label style={labelStyle}>Date souhaitée</label>
                            <input
                              type="date"
                              value={formData.workshopDate}
                              onChange={(e) => setFormData((f) => ({ ...f, workshopDate: e.target.value }))}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Nombre de participants</label>
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={formData.groupSize}
                              onChange={(e) => setFormData((f) => ({ ...f, groupSize: e.target.value }))}
                              placeholder="Ex: 6"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Message complémentaire</label>
                          <textarea
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                            placeholder="Contraintes particulières, allergies, anniversaire d'entreprise..."
                            style={{ ...inputStyle, resize: "vertical" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    style={{
                      background: C.caramel,
                      color: C.white,
                      padding: "15px 28px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 15,
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {activeTab === "b2b" ? "Demander un devis" : activeTab === "workshop" ? "Réserver l'atelier" : "Envoyer le message"}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ background: C.white, borderRadius: 16, padding: 52, border: `2px solid ${C.caramel}`, textAlign: "center" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                >
                  <CheckCircle size={56} color={C.caramel} style={{ marginBottom: 20 }} />
                </motion.div>
                <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: C.espresso, marginBottom: 14 }}>
                  Merci
                </h3>
                <p style={{ fontSize: 15, color: C.textMuted, fontWeight: 300, lineHeight: 1.8, marginBottom: 28 }}>
                  Merci, nous vous répondrons sous 24h.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{ background: C.caramelLight, color: C.caramel, padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            )}
          </SectionReveal>
        </div>
      </div>

      {/* ─── SUBSCRIPTION FAQ ─────────────────────────────────────────────── */}
      <section style={{ padding: "80px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: C.caramel, marginBottom: 14 }}>
                FAQ Abonnement
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.espresso }}>
                Questions sur l'abonnement
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {SUBSCRIPTION_FAQ.map((faq, i) => (
              <ContactFAQItem key={i} faq={faq} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── GENERAL FAQ ─────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 5% 100px", background: C.bg }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <SectionReveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: C.espresso }}>
                Questions générales
              </h2>
            </div>
          </SectionReveal>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <ContactFAQItem key={i} faq={faq} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA TO ABONNEMENT ────────────────────────────────────────────── */}
      <section style={{ padding: "60px 5%", background: C.espresso, textAlign: "center" }}>
        <SectionReveal>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, color: C.cream, marginBottom: 16 }}>
            Prêt à commander ?
          </h2>
          <p style={{ fontSize: 16, color: C.sand, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.8, fontWeight: 300 }}>
            Découvrez nos formules d'abonnement ou commandez à l'unité. Livraison offerte dès 35€.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/templates/impact-38/abonnement" style={{ textDecoration: "none" }}>
              <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.caramel, color: C.espresso, padding: "14px 32px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>
                Voir les abonnements <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/templates/impact-38/workshops" style={{ textDecoration: "none" }}>
              <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.cream, padding: "14px 32px", borderRadius: 8, fontWeight: 600, fontSize: 15, border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
                Voir les ateliers
              </button>
            </Link>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
