"use client";

import React from "react";
import { C, PageHero } from "../shared";

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

export default function Legal() {
  const sectionTitle: React.CSSProperties = { fontFamily: SERIF, fontSize: 23, color: C.accent, marginTop: 40, marginBottom: 14, fontWeight: 700 };
  const para: React.CSSProperties = { fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.9, marginBottom: 14 };

  return (
    <div>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <section style={{ background: C.bg, padding: "64px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={sectionTitle}>Éditeur du site</h2>
          <p style={para}>
            <strong style={{ color: C.text }}>Valentin Milliand</strong>, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse communiquée sur demande à valentinmilliand@aevia.services).
          </p>
          <p style={para}>Directeur de la publication : <strong style={{ color: C.text }}>Valentin Milliand</strong>.</p>
          <p style={para}>Contact : <strong style={{ color: C.text }}>valentinmilliand@aevia.services</strong></p>

          <h2 style={sectionTitle}>TVA</h2>
          <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

          <h2 style={sectionTitle}>Hébergeur</h2>
          <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

          <h2 style={sectionTitle}>Propriété intellectuelle</h2>
          <p style={para}>L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable de l'éditeur.</p>

          <h2 style={sectionTitle}>Données personnelles</h2>
          <p style={para}>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, écrivez à valentinmilliand@aevia.services.</p>
        </div>
      </section>
    </div>
  );
}
