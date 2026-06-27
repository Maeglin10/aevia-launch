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

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: T.bg, color: T.text, fontFamily: FONT_BODY }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <Link href="/templates/impact-01" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.muted, textDecoration: "none", marginBottom: 60, fontSize: "0.9rem", transition: "color 0.2s" }} onMouseOver={(e) => (e.currentTarget.style.color = T.text)} onMouseOut={(e) => (e.currentTarget.style.color = T.muted)}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, margin: "0 0 48px 0", letterSpacing: "-0.02em" }}>
            Politique de <span style={{ color: T.accent }}>Confidentialité</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 40, color: T.muted, lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>1. Collecte des données</h2>
              <p>Nous collectons les données personnelles que vous nous fournissez volontairement via nos formulaires de contact, notamment votre nom, adresse email, et les détails de votre projet. Ces données sont nécessaires pour répondre à vos demandes et traiter vos dossiers.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>2. Utilisation des données</h2>
              <p>Les informations que nous recueillons sont utilisées exclusivement pour :</p>
              <ul style={{ paddingLeft: 24, marginTop: 8 }}>
                <li>Vous contacter et répondre à vos requêtes</li>
                <li>Gérer la relation commerciale (devis, facturation)</li>
                <li>Améliorer l'expérience utilisateur sur notre site</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>3. Protection de vos données</h2>
              <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Vos données ne seront ni vendues, ni échangées, ni transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: "1.5rem", color: T.text, marginBottom: 16 }}>4. Vos droits</h2>
              <p>Conformément à la réglementation applicable en matière de protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données. Pour exercer ces droits, veuillez nous contacter à : privacy@impact-agency.com.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
