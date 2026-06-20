"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  ChevronDown,
  CheckCircle,
  Leaf,
  Send,
  User,
  ArrowLeft,
} from "lucide-react";
import { C, FONT_HEADING, FONT_BODY, CONTACT_FAQS, WEEK_SCHEDULE } from "../shared";

// ─── Data ─────────────────────────────────────────────────────────────────────
const DISCIPLINES = [
  "Hatha Yoga",
  "Vinyasa Flow",
  "Yin Yoga",
  "Méditation",
  "Pranayama",
  "Kundalini",
  "Pilates Yoga",
  "Yoga Nidra",
  "Ashtanga",
  "Je ne sais pas encore",
];

const LEVELS = ["Débutant absolu", "Quelques cours déjà", "Intermédiaire", "Pratiquant régulier", "Avancé"];

const SLOTS = ["Matin (7h–12h)", "Midi (12h–14h)", "Après-midi (14h–17h)", "Soir (17h–21h)", "Week-end"];

const HOURS = [
  { day: "Lundi – Vendredi", time: "07h00 – 21h00" },
  { day: "Samedi", time: "08h00 – 19h00" },
  { day: "Dimanche", time: "09h00 – 18h00" },
  { day: "Jours fériés", time: "10h00 – 16h00" },
];

// ─── Hero Contact ──────────────────────────────────────────────────────────────
function ContactHero() {
  return (
    <section
      style={{
        padding: "80px 80px 60px",
        background: `linear-gradient(160deg, ${C.bg} 0%, ${C.sageLight} 100%)`,
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT_BODY,
      }}
    >
      {/* Decorative blob */}
      <motion.div
        style={{ position: "absolute", top: -60, right: -60, width: 320, height: 320, borderRadius: "50%", background: C.accentLight, opacity: 0.4, pointerEvents: "none" }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Link href="/templates/impact-31" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32, color: C.textMuted, fontSize: 14 }}>
          <motion.span style={{ display: "inline-flex", alignItems: "center", gap: 6 }} whileHover={{ color: C.accent, x: -3 }}>
            <ArrowLeft size={16} />
            Retour à l'accueil
          </motion.span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.sageLight, border: `1px solid ${C.sage}`, borderRadius: 20, padding: "7px 16px", marginBottom: 24 }}>
            <Leaf size={14} color={C.sage} />
            <span style={{ color: C.sage, fontSize: 13, fontWeight: 600 }}>Premier cours 100% gratuit</span>
          </div>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(34px, 4vw, 56px)", fontWeight: 700, color: C.text, lineHeight: 1.12, letterSpacing: -0.8, marginBottom: 16 }}>
            Réservez votre cours{" "}
            <em style={{ color: C.accent, fontStyle: "italic" }}>d'essai gratuit</em>
          </h1>
          <p style={{ fontSize: 17, color: C.textMuted, lineHeight: 1.72, maxWidth: 580 }}>
            Remplissez le formulaire ci-dessous et nous vous contacterons dans les 24h pour confirmer votre créneau. Aucun engagement, juste un premier pas.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact Form ──────────────────────────────────────────────────────────────
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  discipline: string;
  level: string;
  slot: string;
  message: string;
  gdpr: boolean;
}

function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    discipline: "",
    level: "",
    slot: "",
    message: "",
    gdpr: false,
  });

  const update = (key: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!form.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email valide requis";
    if (!form.discipline) newErrors.discipline = "Choisissez une discipline";
    if (!form.level) newErrors.level = "Choisissez votre niveau";
    if (!form.gdpr) newErrors.gdpr = "Vous devez accepter les conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Simulated submission (demo template — no real API call)
    setSubmitted(true);
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1.5px solid ${hasError ? C.accent : C.border}`,
    background: C.white,
    fontSize: 15,
    color: C.text,
    fontFamily: FONT_BODY,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: C.text,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 12,
    color: C.accent,
    marginTop: 4,
  };

  return (
    <div ref={ref} style={{ flex: "1 1 520px" }}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            style={{ background: C.white, borderRadius: 24, padding: "44px 40px", border: `1px solid ${C.border}`, boxShadow: C.shadowLg, display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 6 }}>
                Inscription cours d'essai
              </h2>
              <p style={{ fontSize: 14, color: C.textMuted }}>Tous les champs marqués * sont obligatoires.</p>
            </div>

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Prénom *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Marie"
                  style={inputStyle(!!errors.firstName)}
                  onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.firstName ? C.accent : C.border; }}
                />
                {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Nom *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Dupont"
                  style={inputStyle(!!errors.lastName)}
                  onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.lastName ? C.accent : C.border; }}
                />
                {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="marie@email.com"
                  style={inputStyle(!!errors.email)}
                  onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.email ? C.accent : C.border; }}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="06 12 34 56 78"
                  style={inputStyle(false)}
                  onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; }}
                />
              </div>
            </div>

            {/* Discipline */}
            <div>
              <label style={labelStyle}>Discipline souhaitée *</label>
              <select
                value={form.discipline}
                onChange={(e) => update("discipline", e.target.value)}
                style={{ ...inputStyle(!!errors.discipline), appearance: "none", cursor: "pointer", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a6558' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              >
                <option value="">Choisissez une discipline…</option>
                {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.discipline && <p style={errorStyle}>{errors.discipline}</p>}
            </div>

            {/* Level */}
            <div>
              <label style={labelStyle}>Votre niveau *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LEVELS.map((l) => (
                  <motion.button
                    key={l}
                    type="button"
                    onClick={() => update("level", l)}
                    style={{
                      padding: "9px 16px",
                      borderRadius: 20,
                      border: `1.5px solid ${form.level === l ? C.accent : C.border}`,
                      background: form.level === l ? C.accentLight : C.white,
                      color: form.level === l ? C.accent : C.textMuted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: FONT_BODY,
                      transition: "all 0.15s",
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {l}
                  </motion.button>
                ))}
              </div>
              {errors.level && <p style={errorStyle}>{errors.level}</p>}
            </div>

            {/* Preferred slot */}
            <div>
              <label style={labelStyle}>Créneau préféré</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SLOTS.map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => update("slot", s)}
                    style={{
                      padding: "9px 16px",
                      borderRadius: 20,
                      border: `1.5px solid ${form.slot === s ? C.sage : C.border}`,
                      background: form.slot === s ? C.sageLight : C.white,
                      color: form.slot === s ? C.sage : C.textMuted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: FONT_BODY,
                      transition: "all 0.15s",
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={labelStyle}>Message ou questions (optionnel)</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Parlez-nous de votre pratique, de vos objectifs ou de vos questions…"
                rows={4}
                style={{ ...inputStyle(false), resize: "vertical", minHeight: 100 }}
                onFocus={(e) => { e.target.style.borderColor = C.accent; }}
                onBlur={(e) => { e.target.style.borderColor = C.border; }}
              />
            </div>

            {/* GDPR */}
            <div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
                  <input
                    type="checkbox"
                    checked={form.gdpr}
                    onChange={(e) => update("gdpr", e.target.checked)}
                    style={{ opacity: 0, position: "absolute", width: 18, height: 18, cursor: "pointer" }}
                  />
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${errors.gdpr ? C.accent : form.gdpr ? C.sage : C.border}`, background: form.gdpr ? C.sageLight : C.white, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                    {form.gdpr && <CheckCircle size={12} color={C.sage} />}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>
                  J'accepte que mes données soient utilisées pour traiter ma demande d'inscription et être contacté(e) par Ananda Flow. Conformément au RGPD, vous pouvez exercer vos droits à tout moment via{" "}
                  <Link href="/templates/impact-31/legal" style={{ color: C.accent, textDecoration: "none" }}>notre politique de confidentialité</Link>. *
                </span>
              </label>
              {errors.gdpr && <p style={errorStyle}>{errors.gdpr}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              style={{
                background: C.accent,
                color: C.white,
                border: "none",
                borderRadius: 25,
                padding: "16px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: FONT_BODY,
                boxShadow: "0 6px 24px rgba(192,97,74,0.3)",
              }}
              whileHover={{ background: C.accentDark, scale: 1.02, boxShadow: "0 8px 32px rgba(192,97,74,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Send size={18} />
              Envoyer ma demande d'inscription
            </motion.button>

            <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center" }}>
              Réponse garantie sous 24h — Aucun engagement
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ background: C.white, borderRadius: 24, padding: "60px 40px", border: `1px solid ${C.border}`, boxShadow: C.shadowLg, textAlign: "center" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{ width: 80, height: 80, borderRadius: "50%", background: C.sageLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}
            >
              <CheckCircle size={40} color={C.sage} />
            </motion.div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12 }}>
              Demande envoyée !
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.72, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
              Merci {form.firstName} ! Nous vous contacterons dans les 24h pour confirmer votre créneau de cours d'essai gratuit.
            </p>
            <div style={{ background: C.bgSection, borderRadius: 16, padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>Récapitulatif :</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: C.textMuted }}>
                <div style={{ display: "flex", gap: 10 }}><User size={15} color={C.sage} /><span>{form.firstName} {form.lastName} — {form.email}</span></div>
                <div style={{ display: "flex", gap: 10 }}><Leaf size={15} color={C.sage} /><span>Discipline : {form.discipline}</span></div>
                {form.slot && <div style={{ display: "flex", gap: 10 }}><Clock size={15} color={C.sage} /><span>Créneau préféré : {form.slot}</span></div>}
              </div>
            </div>
            <Link href="/templates/impact-31" style={{ textDecoration: "none" }}>
              <motion.button
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 25, padding: "13px 30px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY }}
                whileHover={{ background: C.accentDark, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Retour à l'accueil
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Info Panel ────────────────────────────────────────────────────────────────
function InfoPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} style={{ flex: "0 0 340px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Contact card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ background: C.white, borderRadius: 20, padding: "32px 30px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
      >
        <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20 }}>Nous contacter</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { icon: <MapPin size={18} color={C.accent} />, label: "Adresse", value: "18 Rue de la Paix, 69002 Lyon" },
            { icon: <Phone size={18} color={C.accent} />, label: "Téléphone", value: "04 72 34 56 78" },
            { icon: <Mail size={18} color={C.accent} />, label: "Email", value: "namaste@anandaflow.fr" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hours card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.white, borderRadius: 20, padding: "32px 30px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Clock size={18} color={C.sage} />
          <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text }}>Horaires d'ouverture</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HOURS.map((h) => (
            <div key={h.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{h.day}</span>
              <span style={{ fontSize: 13, color: C.accent, fontWeight: 700 }}>{h.time}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: C.sageLight, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Leaf size={14} color={C.sage} style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: C.sage, lineHeight: 1.55 }}>Le studio ferme exceptionnellement lors des retraites trimestrielles. Consultez notre agenda en ligne.</p>
        </div>
      </motion.div>

      {/* Google Maps embed */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow, height: 220 }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.4858934060297!2d4.830884!3d45.749530!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4ea5bcc9b7cd3%3A0x9a17d7a0a2d53bf0!2sPlace%20Bellecour%2C%2069002%20Lyon!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation Ananda Flow Studio — Lyon 2e"
        />
      </motion.div>

      {/* Next available classes */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ background: `linear-gradient(135deg, ${C.text} 0%, #5a3a28 100%)`, borderRadius: 20, padding: "28px 28px", boxShadow: C.shadow }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Calendar size={16} color={C.accent} />
          <h3 style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: C.white }}>Prochains cours disponibles</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {WEEK_SCHEDULE.filter((c) => c.spots > 0).slice(0, 4).map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{c.day} · {c.time}</div>
              </div>
              <div style={{ fontSize: 12, color: c.spots <= 3 ? C.accent : "rgba(255,255,255,0.6)", fontWeight: 700 }}>
                {c.spots} place{c.spots > 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────
function ContactFAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={ref} style={{ padding: "80px 80px 100px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ textAlign: "center", marginBottom: 52 }}
      >
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Avant votre visite
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>
          Questions pratiques
        </h2>
      </motion.div>

      <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12, alignItems: "start" }}>
        {CONTACT_FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${open === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", fontFamily: FONT_BODY }}
            >
              <span style={{ fontWeight: 600, fontSize: 15, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
                <ChevronDown size={18} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 20px 18px", fontSize: 14, color: C.textMuted, lineHeight: 1.72 }}>{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA Strip ─────────────────────────────────────────────────────────────────
function CTAStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} style={{ padding: "60px 80px", background: C.accent, fontFamily: FONT_BODY }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, maxWidth: 1100, margin: "0 auto" }}
      >
        <div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: C.white, marginBottom: 8 }}>
            Des questions ? Appelez-nous directement.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>Notre équipe est disponible Lun–Ven de 9h à 19h pour vous orienter.</p>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href="tel:+33472345678" style={{ textDecoration: "none" }}>
            <motion.button
              style={{ background: C.white, color: C.accent, border: "none", borderRadius: 25, padding: "13px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
              whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone size={16} /> 04 72 34 56 78
            </motion.button>
          </a>
          <a href="mailto:namaste@anandaflow.fr" style={{ textDecoration: "none" }}>
            <motion.button
              style={{ background: "transparent", color: C.white, border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 25, padding: "12px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
              whileHover={{ borderColor: C.white, background: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={16} /> Envoyer un email
            </motion.button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Main Contact Page ─────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section style={{ padding: "60px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
          <ContactForm />
          <InfoPanel />
        </div>
      </section>
      <ContactFAQ />
      <CTAStrip />
    </>
  );
}
