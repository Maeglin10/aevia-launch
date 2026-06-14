"use client";

import React from "react";
import { C, PageHero } from "../shared";

const SERIF = "'Libre Baskerville', Georgia, serif";
const SANS = "'Poppins', system-ui";

export default function CGV() {
  const sectionTitle: React.CSSProperties = { fontFamily: SERIF, fontSize: 23, color: C.accent, marginTop: 40, marginBottom: 14, fontWeight: 700 };
  const para: React.CSSProperties = { fontFamily: SANS, fontSize: 15, color: C.textMuted, lineHeight: 1.9, marginBottom: 14 };

  return (
    <div>
      <PageHero eyebrow="Conditions générales" title="Conditions générales de vente" />
      <section style={{ background: C.bg, padding: "64px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...para, fontStyle: "italic", color: C.textDim }}>Dernière mise à jour : juin 2026.</p>

          <h2 style={sectionTitle}>Article 1 — Objet</h2>
          <p style={para}>Les présentes conditions générales de vente régissent les relations contractuelles entre Pétales & Co et tout client effectuant un achat sur le site. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>

          <h2 style={sectionTitle}>Article 2 — Prix</h2>
          <p style={para}>Les prix sont indiqués en euros, toutes taxes comprises. Pétales & Co se réserve le droit de modifier ses prix à tout moment ; les articles sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>

          <h2 style={sectionTitle}>Article 3 — Commande</h2>
          <p style={para}>La commande est validée après confirmation du paiement. Un email récapitulatif est adressé au client. Pétales & Co se réserve le droit d'annuler toute commande en cas de litige de paiement ou de rupture de stock saisonnière.</p>

          <h2 style={sectionTitle}>Article 4 — Paiement</h2>
          <p style={para}>Le règlement s'effectue par carte bancaire via un prestataire de paiement sécurisé. Aucune donnée bancaire n'est conservée par Pétales & Co.</p>

          <h2 style={sectionTitle}>Article 5 — Livraison</h2>
          <p style={para}>Nous livrons dans Paris et l'Île-de-France. La livraison est offerte dans Paris ; un supplément peut s'appliquer en Île-de-France pour les commandes ponctuelles. Les fleurs étant des produits périssables, le client veille à être disponible au créneau de livraison convenu.</p>

          <h2 style={sectionTitle}>Article 6 — Droit de rétractation</h2>
          <p style={para}>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux biens périssables tels que les fleurs fraîches et compositions florales. Toute réclamation relative à la fraîcheur doit être signalée dans les 24h suivant la réception, photo à l'appui.</p>

          <h2 style={sectionTitle}>Article 7 — Garanties</h2>
          <p style={para}>Nous garantissons la fraîcheur de nos fleurs à la livraison. En cas de produit non conforme, un remplacement ou un avoir sera proposé après examen de la réclamation.</p>

          <h2 style={sectionTitle}>Article 8 — Droit applicable</h2>
          <p style={para}>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>
        </div>
      </section>
    </div>
  );
}
