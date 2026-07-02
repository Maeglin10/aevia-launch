"use client";

import React from "react";
import { C, TextReveal } from "../shared";

export default function LegalPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh", padding: "80px 5% 120px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", fontFamily: C.fontSans, color: C.charcoal }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <TextReveal>
            <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.sage, marginBottom: 16 }}>
              Information
            </div>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1 style={{ fontFamily: C.font, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, fontStyle: "italic", margin: 0 }}>
              Legal Notice & Terms
            </h1>
          </TextReveal>
        </div>

        <div style={{ lineHeight: 1.8, fontSize: 15, fontWeight: 300 }}>
          {/* French Legal Notice */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: C.font, fontSize: 24, color: C.goldDark, marginBottom: 16, borderBottom: `1px solid ${C.mist}`, paddingBottom: 8 }}>
              Mentions Légales (FR)
            </h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Éditeur du site :</strong> Valentin Milliand, propriétaire d'Aevia WS.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Immatriculation :</strong> SIREN 852 546 225, enregistré au Registre du Commerce et des Sociétés (RCS) de Bourg-en-Bresse.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Siège social :</strong> Adresse physique non publiée pour des raisons de confidentialité (adresse communiquée sur demande à valentinmilliand@aevia.services).
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Contact :</strong> valentinmilliand@aevia.services
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Hébergeur :</strong> Google Firebase App Hosting (Google Cloud LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).
            </p>
          </section>

          {/* English Legal Notice */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: C.font, fontSize: 24, color: C.goldDark, marginBottom: 16, borderBottom: `1px solid ${C.mist}`, paddingBottom: 8 }}>
              Legal Notice (EN)
            </h2>
            <p style={{ marginBottom: 12 }}>
              <strong>Website Publisher:</strong> Valentin Milliand, owner of Aevia WS.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Registration:</strong> SIREN 852 546 225, registered with the Registry of Commerce and Companies (RCS) of Bourg-en-Bresse.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Physical Address:</strong> Private address withheld for security reasons (address provided upon request at valentinmilliand@aevia.services).
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Contact Email:</strong> valentinmilliand@aevia.services
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Hosting Provider:</strong> Google Firebase App Hosting (Google Cloud LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA).
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 style={{ fontFamily: C.font, fontSize: 24, color: C.goldDark, marginBottom: 16, borderBottom: `1px solid ${C.mist}`, paddingBottom: 8 }}>
              Privacy Policy
            </h2>
            <p style={{ marginBottom: 12 }}>
              We respect your privacy. All reservation request data (such as name, email, phone number, and special request details) are collected solely to process your inquiry and are never shared with third parties.
            </p>
            <p style={{ marginBottom: 12 }}>
              You have the right to access, rectify, or request the deletion of your personal data by contacting valentinmilliand@aevia.services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
