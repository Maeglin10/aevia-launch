import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Maison Maria",
  description: "Politique de confidentialité et protection des données personnelles de Maison Maria — conformité RGPD.",
  robots: { index: false, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <div style={{ background: "#fdfaf5", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <MiniNav active="confidentialite" />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(24px,6vw,48px)" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#c4847a", marginBottom: 12, fontWeight: 500 }}>RGPD · Vos données</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 400, color: "#1a1412", lineHeight: 1.1, marginBottom: 20 }}>
            Politique de Confidentialité
          </h1>
          <p style={{ color: "#8a7570", fontSize: 14, lineHeight: 1.7 }}>
            En vigueur au 1er juin 2026 · Conforme au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée.
          </p>
        </div>

        <Section title="1. Responsable du traitement">
          <p><strong>Maison Maria</strong> — Maria (auto-entrepreneuse)</p>
          <p>10 Rue Jean-Baptiste Clément, 69200 Vénissieux — contact@maison-maria.fr — 06 17 86 79 69</p>
        </Section>

        <Section title="2. Données collectées et finalités">
          <table>
            <thead>
              <tr>
                <th>Données</th>
                <th>Finalité</th>
                <th>Base légale</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nom, prénom, téléphone, e-mail</td>
                <td>Gestion des réservations (Planity)</td>
                <td>Exécution du contrat</td>
                <td>3 ans après dernier RDV</td>
              </tr>
              <tr>
                <td>Données de santé (contre-indications, allergies)</td>
                <td>Sécurité de la prestation esthétique</td>
                <td>Intérêt légitime / consentement</td>
                <td>Durée de la relation commerciale</td>
              </tr>
              <tr>
                <td>Données de paiement (achat e-book)</td>
                <td>Traitement de la commande</td>
                <td>Exécution du contrat</td>
                <td>5 ans (obligations comptables)</td>
              </tr>
              <tr>
                <td>Données de navigation (cookies analytiques)</td>
                <td>Amélioration du site</td>
                <td>Consentement</td>
                <td>13 mois</td>
              </tr>
              <tr>
                <td>E-mail (newsletter / communications)</td>
                <td>Envoi d'informations et promotions</td>
                <td>Consentement</td>
                <td>Jusqu'au désabonnement</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 16 }}>Nous ne collectons pas de données sensibles (origines raciales, opinions politiques, etc.) au-delà des informations médicales strictement nécessaires à la sécurité de vos soins esthétiques.</p>
        </Section>

        <Section title="3. Destinataires des données">
          <p>Vos données sont traitées exclusivement par Maison Maria et ses sous-traitants techniques indispensables :</p>
          <ul>
            <li><strong>Planity</strong> (gestion des rendez-vous) — hébergé en Europe — <a href="https://www.planity.com/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>politique de confidentialité Planity</a></li>
            <li><strong>Stripe</strong> (paiement en ligne) — certifié PCI-DSS niveau 1 — <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>politique Stripe</a></li>
            <li><strong>Vercel</strong> (hébergement du site) — données de logs 30 jours</li>
          </ul>
          <p style={{ marginTop: 12 }}>Maison Maria ne revend jamais vos données à des tiers à des fins commerciales.</p>
        </Section>

        <Section title="4. Transferts hors UE">
          <p>Certains de nos sous-traitants (Stripe, Vercel) sont des sociétés américaines. Ces transferts sont encadrés par des clauses contractuelles types (CCT) approuvées par la Commission européenne, ou par le mécanisme Data Privacy Framework UE-États-Unis, garantissant un niveau de protection adéquat.</p>
        </Section>

        <Section title="5. Vos droits">
          <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> (art. 15 RGPD) : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> (art. 16 RGPD) : corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> (art. 17 RGPD) : demander la suppression de vos données (sous réserve des obligations légales de conservation)</li>
            <li><strong>Droit à la limitation</strong> (art. 18 RGPD) : restreindre le traitement</li>
            <li><strong>Droit à la portabilité</strong> (art. 20 RGPD) : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> (art. 21 RGPD) : vous opposer au traitement basé sur notre intérêt légitime</li>
            <li><strong>Retrait du consentement</strong> : à tout moment pour les traitements fondés sur votre consentement</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            Pour exercer vos droits : <a href="mailto:contact@maison-maria.fr" style={{ color: "#c4847a" }}>contact@maison-maria.fr</a> ou par courrier à l'adresse de l'établissement. Nous répondons dans un délai maximum de <strong>30 jours</strong>.
          </p>
          <p style={{ marginTop: 12 }}>
            En cas de réclamation non résolue, vous pouvez saisir la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) — 3 Place de Fontenoy, 75007 Paris — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>cnil.fr</a>.
          </p>
        </Section>

        <Section title="6. Sécurité des données">
          <p>Maison Maria met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou divulgation accidentelle :</p>
          <ul>
            <li>Connexions chiffrées (HTTPS / TLS 1.3)</li>
            <li>Accès aux données restreint aux personnes habilitées</li>
            <li>Prestataires de paiement certifiés PCI-DSS</li>
            <li>Sauvegardes régulières des données</li>
          </ul>
        </Section>

        <Section title="7. Cookies">
          <p>Pour plus d'informations sur les cookies utilisés par notre site, consultez notre <Link href="/maison-maria/legal/cookies" style={{ color: "#c4847a" }}>Politique Cookies</Link>.</p>
        </Section>

        <Section title="8. Modifications">
          <p>Maison Maria se réserve le droit de modifier la présente politique à tout moment. La date de mise à jour figurant en bas de page fait foi. En cas de modification substantielle affectant vos droits, vous en serez informé par e-mail (si vous nous avez communiqué votre adresse) ou par un bandeau d'information sur le site.</p>
        </Section>

        <Section title="9. Contact DPO">
          <p>Maison Maria est une micro-entreprise individuelle. La responsable du traitement et interlocutrice pour toute question relative à vos données est Maria :</p>
          <p style={{ marginTop: 8 }}>📧 <a href="mailto:contact@maison-maria.fr" style={{ color: "#c4847a" }}>contact@maison-maria.fr</a> · 📞 06 17 86 79 69</p>
        </Section>

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid #ede4d6", fontSize: 12, color: "#8a7570" }}>
          Dernière mise à jour : 1er juin 2026
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}

function MiniNav({ active }: { active: string }) {
  const links = [
    { label: "Mentions légales", href: "/maison-maria/legal/mentions-legales", key: "mentions" },
    { label: "CGV", href: "/maison-maria/legal/cgv", key: "cgv" },
    { label: "Confidentialité", href: "/maison-maria/legal/confidentialite", key: "confidentialite" },
    { label: "Cookies", href: "/maison-maria/legal/cookies", key: "cookies" },
  ];
  return (
    <nav style={{ borderBottom: "1px solid #ede4d6", padding: "0 clamp(20px,6vw,80px)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
      <Link href="/maison-maria" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: "#1a1412", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, color: "#8a7570" }}>←</span>
        Maison Maria
      </Link>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {links.map((l) => (
          <Link key={l.key} href={l.href} style={{ fontSize: 12, color: l.key === active ? "#c4847a" : "#8a7570", textDecoration: "none", letterSpacing: "0.05em", fontWeight: l.key === active ? 600 : 400 }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 500, color: "#1a1412", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #ede4d6" }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.85, color: "#5c4d48" }}>
        {children}
      </div>
      <style>{`
        section p { margin: 0 0 8px; }
        section ul { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        th { background: #f7f2ea; padding: 10px 14px; text-align: left; font-weight: 600; color: #1a1412; border: 1px solid #ede4d6; }
        td { padding: 10px 14px; border: 1px solid #ede4d6; vertical-align: top; color: #5c4d48; }
      `}</style>
    </section>
  );
}

function LegalFooter() {
  return (
    <footer style={{ background: "#120e0c", padding: "40px clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: "rgba(255,255,255,0.8)" }}>Maison Maria</span>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Mentions légales", href: "/maison-maria/legal/mentions-legales" },
            { label: "CGV", href: "/maison-maria/legal/cgv" },
            { label: "Confidentialité", href: "/maison-maria/legal/confidentialite" },
            { label: "Cookies", href: "/maison-maria/legal/cookies" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
