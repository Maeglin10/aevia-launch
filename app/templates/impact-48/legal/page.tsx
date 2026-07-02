"use client";

import React from "react";
import { C, F, PageHero } from "../shared";

export default function Legal() {
  const sectionTitle: React.CSSProperties = {
    fontFamily: F.sans,
    fontSize: 20,
    fontWeight: 700,
    color: C.text,
    letterSpacing: '-0.01em',
    margin: '40px 0 14px',
  };
  const para: React.CSSProperties = {
    fontFamily: F.sans,
    fontSize: 15,
    color: C.textMuted,
    lineHeight: 1.85,
    marginBottom: 14,
    letterSpacing: '0.01em',
  };
  const strong: React.CSSProperties = { color: C.text, fontWeight: 700 };

  return (
    <div>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <section style={{ background: C.bg, padding: '90px 40px 120px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ ...sectionTitle, marginTop: 0 }}>Éditeur du site</h2>
          <p style={para}>
            <span style={strong}>Valentin Milliand</span>, SIREN <span style={strong}>852 546 225</span>, RCS Bourg-en-Bresse (adresse communiquée sur demande à <span style={strong}>valentinmilliand@aevia.services</span>).
          </p>
          <p style={para}>
            Directeur de la publication : <span style={strong}>Valentin Milliand</span>.
          </p>
          <p style={para}>
            Contact : <span style={strong}>valentinmilliand@aevia.services</span>
          </p>

          <h2 style={sectionTitle}>TVA</h2>
          <p style={para}>TVA non applicable, art. 293 B du CGI.</p>

          <h2 style={sectionTitle}>Hébergeur</h2>
          <p style={para}>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>

          <h2 style={sectionTitle}>Propriété intellectuelle</h2>
          <p style={para}>
            L'ensemble des contenus présents sur ce site (textes, visuels, plans, logo, mise en page) est protégé par
            le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation
            préalable de l'éditeur.
          </p>

          <h2 style={sectionTitle}>Responsabilité</h2>
          <p style={para}>
            Les informations diffusées sur ce site sont fournies à titre indicatif et ne sauraient engager la
            responsabilité de l'éditeur ou de l'atelier. Les projets présentés le sont à des fins illustratives.
          </p>
        </div>
      </section>
    </div>
  );
}
