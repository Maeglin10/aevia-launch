import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Maison Maria",
  description: "Conditions générales de vente des prestations et produits numériques de Maison Maria, institut de beauté à Vénissieux.",
  robots: { index: false, follow: false },
};

const C = {
  bg: "#fdfaf5",
  dark: "#1a1412",
  rose: "#c4847a",
  ivory: "#f7f2ea",
  ivoryDark: "#ede4d6",
  textMuted: "#8a7570",
  bodyText: "#5c4d48",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'DM Sans', system-ui, sans-serif",
};

export default function CGVPage() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.fontSans }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <MiniNav active="cgv" />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(24px,6vw,48px)" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.rose, marginBottom: 12, fontWeight: 500 }}>Contractuel</div>
          <h1 style={{ fontFamily: C.font, fontSize: "clamp(40px,6vw,72px)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: 20 }}>
            Conditions Générales de Vente
          </h1>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>
            En vigueur au 1er juin 2026 · Applicables aux prestations de soins et aux produits numériques (e-books, formations) vendus par Maison Maria.
          </p>
        </div>

        <Section title="1. Identification du vendeur">
          <p>
            <strong>Maison Maria</strong> — entreprise individuelle (auto-entrepreneur)<br />
            Fondatrice : Maria<br />
            Adresse : 10 Rue Jean-Baptiste Clément, 69200 Vénissieux, France<br />
            Téléphone : 06 17 86 79 69<br />
            E-mail : contact@maison-maria.fr
          </p>
          <p style={{ marginTop: 12 }}>
            Les présentes conditions générales de vente régissent les relations contractuelles entre Maison Maria et ses clients (ci-après « le Client ») pour toute commande de prestation de soins esthétiques et/ou d'achat de produit numérique (e-book ou formation en ligne).
          </p>
        </Section>

        <Section title="2. Prestations de soins esthétiques">
          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>2.1 Réservation</h3>
          <p>La prise de rendez-vous s'effectue exclusivement via la plateforme Planity (<a href="https://www.planity.com/maison-maria-69200-venissieux" target="_blank" rel="noopener noreferrer" style={{ color: C.rose }}>planity.com</a>) ou par téléphone au 06 17 86 79 69. Toute réservation est soumise à la disponibilité de l'agenda. La confirmation de rendez-vous vaut acceptation des présentes CGV.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>2.2 Tarifs</h3>
          <p>Les tarifs des prestations sont ceux affichés sur le site et sur la plateforme Planity au moment de la réservation, en euros TTC. Une majoration de <strong>10 €</strong> est appliquée aux prestations réalisées entre 21h00 et 06h00, ainsi que le dimanche. Les prix peuvent être modifiés à tout moment ; le tarif applicable est celui en vigueur lors de la confirmation de rendez-vous.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>2.3 Paiement</h3>
          <p>Le règlement s'effectue le jour de la prestation, en espèces, par carte bancaire (CB, Visa, Mastercard) ou via les modes de paiement acceptés en salon. Aucun avoir ne sera émis au-delà de 7 jours suivant la prestation.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>2.4 Annulation et report</h3>
          <p>Toute annulation ou report doit être signalé <strong>au moins 24 heures avant</strong> le rendez-vous, par téléphone ou via la plateforme Planity. En cas de non-présentation sans avis préalable (« no-show »), Maison Maria se réserve le droit de facturer une indemnité ou de refuser les futures réservations de ce client.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>2.5 Responsabilité esthétique</h3>
          <p>Le résultat des prestations esthétiques (extensions de cils, micropigmentation, blanchiment dentaire, etc.) est lié à la qualité des tissus naturels du client, à son hygiène de vie et au respect des consignes d'entretien post-prestation. Les résultats varient d'une personne à l'autre. Maison Maria ne peut être tenu pour responsable d'un résultat ne correspondant pas aux attentes subjectives du client dès lors que la prestation a été réalisée dans les règles de l'art.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>2.6 Contre-indications</h3>
          <p>Il est de la responsabilité du client d'informer Maison Maria, avant toute prestation, de tout antécédent médical, allergie ou traitement en cours susceptible d'être incompatible avec la prestation souhaitée. En cas de doute, un test préalable peut être réalisé. Maison Maria se réserve le droit de refuser une prestation si une contre-indication est identifiée.</p>
        </Section>

        <Section title="3. Produits numériques (e-books et formations)">
          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>3.1 Commande et paiement</h3>
          <p>L'achat d'un produit numérique (e-book, accès à une formation en ligne) s'effectue via la page de vente dédiée sur le site. Le paiement est sécurisé via Stripe. Le prix affiché au moment de la commande est le prix définitif, en euros TTC.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>3.2 Livraison</h3>
          <p>Suite au paiement validé, le produit numérique est remis au client par voie électronique (lien de téléchargement ou accès à la plateforme) dans un délai maximum de <strong>30 minutes</strong>. En cas de problème technique, contactez-nous à contact@maison-maria.fr.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>3.3 Droit de rétractation</h3>
          <p>
            Conformément à l'article L.221-28 du Code de la consommation, <strong>le droit de rétractation ne peut être exercé pour les contenus numériques dès lors que l'exécution a commencé avec l'accord du consommateur et qu'il a renoncé à son droit de rétractation</strong>.
          </p>
          <p style={{ marginTop: 12 }}>
            Lors de la commande, le client coché une case confirmant qu'il accepte de renoncer à son droit de rétractation dès accès au contenu. Passé ce stade, aucun remboursement ne sera accordé, sauf en cas de défaut avéré du produit.
          </p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>3.4 Propriété intellectuelle</h3>
          <p>Les e-books et formations sont protégés par le droit d'auteur. L'achat confère au client une <strong>licence personnelle, non exclusive et non transférable</strong> d'utilisation du contenu à des fins strictement personnelles. Toute reproduction, revente, diffusion ou partage, même à titre gratuit, est formellement interdit et constitue une contrefaçon passible de poursuites.</p>

          <h3 style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, marginBottom: 12, marginTop: 24 }}>3.5 Garantie</h3>
          <p>Si vous constatez un défaut technique dans le produit numérique (fichier illisible, lien cassé), contactez-nous dans les 7 jours suivant l'achat à contact@maison-maria.fr. Nous procéderons à la correction ou au remplacement du fichier, et au remboursement si la livraison s'avère impossible.</p>
        </Section>

        <Section title="4. Formations certifiantes en présentiel">
          <p>Les formations certifiantes (blanchiment dentaire, extension de cils, strass dentaire, réhaussement de cils, browlift) sont soumises aux conditions suivantes :</p>
          <ul style={{ marginTop: 12 }}>
            <li>Acompte de <strong>50 %</strong> du prix de la formation exigé lors de l'inscription.</li>
            <li>Solde réglé le jour de la formation.</li>
            <li>Annulation acceptée jusqu'à <strong>48 heures avant</strong> la date de formation ; l'acompte sera restitué sous forme d'avoir valable 6 mois. Passé ce délai, l'acompte est conservé.</li>
            <li>Le matériel (kit) inclus dans le prix est fourni le jour de la formation. Toute absence injustifiée n'ouvre pas droit à remboursement.</li>
            <li>Un diplôme/attestation de formation est délivré à l'issue de la formation sous réserve de participation effective.</li>
          </ul>
        </Section>

        <Section title="5. Réclamations et médiation">
          <p>
            En cas de réclamation, le client doit contacter Maison Maria dans un premier temps à l'adresse contact@maison-maria.fr. Nous nous engageons à apporter une réponse dans un délai de 10 jours ouvrés.
          </p>
          <p style={{ marginTop: 12 }}>
            En l'absence de réponse satisfaisante, le client peut recourir gratuitement à un médiateur de la consommation conformément à la directive européenne 2013/11/UE et aux articles L.611-1 et suivants du Code de la consommation. Pour les litiges liés aux services esthétiques, le médiateur compétent est le Médiateur de la Consommation des Professions du Commerce de Bouche, de l'Hôtellerie et de la Restauration (<a href="https://www.cm-lyon.fr" target="_blank" rel="noopener noreferrer" style={{ color: C.rose }}>cm-lyon.fr</a>).
          </p>
        </Section>

        <Section title="6. Droit applicable et juridiction">
          <p>
            Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation et/ou à leur exécution relève de la compétence exclusive des tribunaux du ressort de la Cour d'appel de Lyon, sauf disposition légale contraire applicable aux consommateurs.
          </p>
        </Section>

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: `1px solid ${C.ivoryDark}`, fontFamily: C.fontSans, fontSize: 12, color: C.textMuted }}>
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
          <Link key={l.key} href={l.href} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, color: l.key === active ? "#c4847a" : "#8a7570", textDecoration: "none", letterSpacing: "0.05em", fontWeight: l.key === active ? 600 : 400 }}>
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
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 15, lineHeight: 1.85, color: "#5c4d48" }}>
        {children}
      </div>
      <style>{`
        section p { margin: 0; }
        section ul { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        section h3 { margin: 0; }
        a { color: #c4847a; }
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
            <Link key={l.href} href={l.href} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
