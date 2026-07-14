"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const T = {
  bg: "#0a0a0a",
  text: "#f0f0f0",
  muted: "#666666",
  dimmed: "#333333",
  accent: "#0066ff",
  accentDim: "rgba(0,102,255,0.15)",
  accentBorder: "rgba(0,102,255,0.3)",
  border: "rgba(240,240,240,0.06)",
  surface: "rgba(240,240,240,0.03)",
  surfaceHover: "rgba(240,240,240,0.06)",
};

const FONT_HEADING = "'Syne', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

export default function MentionsPage() {
  return (
    <div style={{ minHeight: "100dvh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 48px 0", letterSpacing: "-0.02em" }}>
            Mentions <span style={{ color: T.accent }}>Légales</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 40, color: T.muted, lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>1. Éditeur du site</h2>
              <p>Le présent site est édité par Impact Agency, Société à Responsabilité Limitée (SARL) au capital de 10 000€, immatriculée au Registre du Commerce et des Sociétés sous le numéro 123 456 789.</p>
              <p style={{ marginTop: 8 }}>Siège social : 123 Creative Ave, 75000 Paris, France.<br/>Email : hello@impact-agency.com<br/>Téléphone : +33 1 23 45 67 89</p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>2. Directeur de la publication</h2>
              <p>Le directeur de la publication est Léa Fontaine, en qualité de Directrice de Création.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>3. Hébergement</h2>
              <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>4. Propriété intellectuelle</h2>
              <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
