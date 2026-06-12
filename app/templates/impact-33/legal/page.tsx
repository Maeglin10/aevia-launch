"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, FONT_HEADING, FONT_BODY } from "../shared";

export default function LegalPage() {
  return (
    <section style={{ padding: "80px 80px 120px", background: C.bg, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Légal
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 40, letterSpacing: -0.5 }}>Mentions Légales & Confidentialité</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 36, color: C.textMuted, lineHeight: 1.8 }}>
          {/* Mentions Legales */}
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>Éditeur du site</h2>
            <p>
              Ce site web est édité pour le compte de l'entreprise individuelle <strong>Aevia WS</strong>, dirigée par Valentin Milliand.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Propriétaire & Éditeur :</strong> Valentin Milliand.<br />
              <strong>Immatriculation :</strong> SIREN 852 546 225, inscrit au Registre du Commerce et des Sociétés (RCS) de Bourg-en-Bresse.<br />
              <strong>Contact :</strong> <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a><br />
              <strong>Siège social :</strong> Adresse communiquée sur demande à contact@aevia.io.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Hébergement :</strong> Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — <a href="https://vercel.com" style={{ color: C.accent }}>vercel.com</a>.
            </p>
          </div>

          {/* Politique de confidentialite */}
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>Politique de confidentialité</h2>
            <p>
              <strong>Responsable du traitement :</strong> Aevia WS — <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Données collectées :</strong> Dans le cadre de l'utilisation de ce site de démonstration, nous sommes susceptibles de collecter les données suivantes : nom et prénom, adresse e-mail, numéro de téléphone. Ces données sont collectées uniquement lors de votre soumission de formulaires (commandes, contact).
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Durée de conservation :</strong> Vos données sont conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction avec notre site, conformément aux obligations légales.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Vos droits :</strong> Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies de traçage publicitaire ou de ciblage tiers. Seuls des cookies de session ou techniques indispensables sont déposés sur votre navigateur.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
