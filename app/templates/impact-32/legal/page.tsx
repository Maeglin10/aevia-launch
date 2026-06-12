"use client";

import React from "react";
import { motion } from "framer-motion";
import { C, FONT, SectionBadge } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ padding: "80px 80px 120px", fontFamily: FONT, background: C.bg, minHeight: "100vh" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ maxWidth: 820, margin: "0 auto" }}>
        <SectionBadge label="Légal" />
        
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, marginBottom: 32 }}>Mentions Légales & Confidentialité</h1>
        
        <div style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.85, display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Mentions Legales */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>1. Mentions Légales</h2>
            <p>
              Ce site web est édité pour le compte de l'entreprise individuelle <strong>Aevia WS</strong>, dirigée par Valentin Milliand.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Propriétaire & Éditeur :</strong> Valentin Milliand.<br />
              <strong>Immatriculation :</strong> SIREN 852 546 225, inscrit au Registre du Commerce et des Sociétés (RCS) de Bourg-en-Bresse.<br />
              <strong>Contact :</strong> <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a><br />
              <strong>Siège social :</strong> Adresse communiquée sur demande à <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>.<br />
              <strong>Réglementation professionnelle :</strong> Clinique vétérinaire soumise aux règles de déontologie édictées par l'Ordre National des Vétérinaires (CNOV).
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Hébergement :</strong> Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA.
            </p>
          </div>

          {/* Politique de confidentialite */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>2. Politique de Confidentialité</h2>
            <p>
              <strong>Responsable du traitement :</strong> Aevia WS — <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Données collectées :</strong> Ce site collecte uniquement les données fournies volontairement via les formulaires de prise de rendez-vous : nom, e-mail, informations relatives à votre animal. Ces données sont utilisées exclusivement pour traiter votre demande opérationnelle.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Durée de conservation :</strong> Vos données sont conservées le temps nécessaire au traitement de votre demande, et au maximum 3 ans conformément aux recommandations de la CNIL.
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Vos droits :</strong> Conformément au RGPD (UE 2016/679), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 12 }}>3. Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies de suivi publicitaire ou de profilage tiers. Seuls des cookies techniques indispensables au bon fonctionnement du site sont mis en œuvre.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
