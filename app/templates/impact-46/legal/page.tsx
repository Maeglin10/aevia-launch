"use client";

import React from "react";
import { C, PageHero } from "../shared";

export default function Legal() {
  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: C.navy,
    margin: "40px 0 14px", fontWeight: 700,
  };
  const para: React.CSSProperties = {
    fontFamily: "'Source Sans Pro', system-ui", fontSize: 16, color: C.textMuted,
    lineHeight: 1.8, marginBottom: 14,
  };
  const strong: React.CSSProperties = { color: C.navy, fontWeight: 700 };

  return (
    <div>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <section style={{ background: C.bg, padding: "80px 32px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ ...sectionTitle, marginTop: 0 }}>Éditeur du site</h2>
          <p style={para}>
            <span style={strong}>Valentin Milliand</span>, SIREN 852 546 225, RCS Bourg-en-Bresse (adresse communiquée sur demande à contact@aevia.io).
          </p>
          <p style={para}>Directeur de la publication : <span style={strong}>Valentin Milliand</span>.</p>
          <p style={para}>Contact : <span style={strong}>contact@aevia.io</span></p>

          <h2 style={sectionTitle}>TVA</h2>
          <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

          <h2 style={sectionTitle}>Hébergeur</h2>
          <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

          <h2 style={sectionTitle}>Propriété intellectuelle</h2>
          <p style={para}>
            L'ensemble des contenus présents sur ce site (textes, visuels, logo, mise en page) est protégé par le droit
            de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation préalable
            de l'éditeur.
          </p>

          <h2 style={sectionTitle}>Responsabilité</h2>
          <p style={para}>
            Les informations diffusées sur ce site sont fournies à titre indicatif et ne constituent pas un conseil
            juridique. Elles ne sauraient engager la responsabilité de l'éditeur ou du cabinet.
          </p>
        </div>
      </section>
    </div>
  );
}
