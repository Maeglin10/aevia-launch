"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, FONT_HEADING, FONT_BODY } from "../shared";

export default function LegalPage() {
  return (
    <section style={{ padding: "80px 80px 120px", background: C.bg, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 800, margin: "0 auto" }}
      >
        <div style={{ display: "inline-block", background: C.sageLight, color: C.sage, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Légal
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, marginBottom: 40, letterSpacing: -0.5 }}>
          Mentions Légales & Confidentialité
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, color: C.textMuted, lineHeight: 1.8 }}>
          {/* Mentions Legales */}
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 14 }}>
              1. Mentions Légales
            </h2>
            <p>
              Ce site web est édité à titre de démonstration pour le compte d'<strong>Aevia WS</strong>, entreprise individuelle dirigée par Valentin Milliand.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Propriétaire & Éditeur :</strong> Valentin Milliand, exerçant sous le nom commercial Aevia WS.<br />
              <strong>Immatriculation :</strong> SIREN 852 546 225, inscrit au Registre du Commerce et des Sociétés (RCS) de Bourg-en-Bresse.<br />
              <strong>Contact :</strong> <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a><br />
              <strong>Siège social :</strong> Adresse communiquée sur demande à contact@aevia.io conformément aux dispositions légales sur la protection de la vie privée.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Hébergeur du site :</strong> Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: C.accent }}>vercel.com</a>.
            </p>
          </div>

          {/* Politique de confidentialite */}
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 14 }}>
              2. Politique de Confidentialité & RGPD
            </h2>
            <p>
              Nous accordons une importance primordiale à la protection de vos données personnelles. Les informations recueillies sur ce site de démonstration (ex. formulaires de contact, de réservation) proviennent de vos soumissions volontaires.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Responsable du traitement :</strong> Aevia WS — <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a><br />
              <strong>Données collectées :</strong> Nom, adresse e-mail, numéro de téléphone, préférences de cours. Ces données sont destinées uniquement à la simulation opérationnelle et commerciale de l'activité du studio.<br />
              <strong>Durée de conservation :</strong> Les données collectées sont supprimées ou anonymisées sous un délai de 3 ans.<br />
              <strong>Vos droits :</strong> Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles en contactant <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 14 }}>
              3. Cookies
            </h2>
            <p>
              Ce site utilise uniquement des cookies techniques essentiels pour assurer la navigation et la fluidité des animations interactives. Aucun cookie de pistage publicitaire ou de profilage tiers n'est utilisé.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
