import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique Cookies — Maison Maria",
  description: "Politique d'utilisation des cookies sur le site Maison Maria — gestion de votre consentement.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <div style={{ background: "#fdfaf5", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <MiniNav active="cookies" />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(24px,6vw,48px)" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#c4847a", marginBottom: 12, fontWeight: 500 }}>Transparence</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 400, color: "#1a1412", lineHeight: 1.1, marginBottom: 20 }}>
            Politique Cookies
          </h1>
          <p style={{ color: "#8a7570", fontSize: 14, lineHeight: 1.7 }}>
            En vigueur au 1er juin 2026 · Conforme aux recommandations de la CNIL (délibération n° 2020-091) et au RGPD.
          </p>
        </div>

        <Section title="1. Qu'est-ce qu'un cookie ?">
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d'un site web. Il permet au site de mémoriser vos préférences, votre session ou votre comportement de navigation pendant une durée définie. Les cookies ne contiennent pas de virus et ne peuvent pas accéder à des données personnelles sur votre appareil.
          </p>
        </Section>

        <Section title="2. Cookies utilisés sur notre site">
          <h3>2.1 Cookies strictement nécessaires (pas de consentement requis)</h3>
          <p>Ces cookies sont indispensables au bon fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
          <table>
            <thead>
              <tr><th>Nom</th><th>Finalité</th><th>Durée</th><th>Éditeur</th></tr>
            </thead>
            <tbody>
              <tr><td><code>__session</code></td><td>Maintien de la session utilisateur (panier, authentification)</td><td>Session</td><td>Maison Maria</td></tr>
              <tr><td><code>_vercel_jwt</code></td><td>Vérification d'accès aux pages protégées</td><td>Session</td><td>Vercel</td></tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: 28 }}>2.2 Cookies de performance / analytiques (consentement requis)</h3>
          <p>Ces cookies nous permettent de comprendre comment les visiteurs utilisent notre site, d'identifier les pages populaires et d'améliorer votre expérience. Toutes les données sont anonymisées.</p>
          <table>
            <thead>
              <tr><th>Nom</th><th>Finalité</th><th>Durée</th><th>Éditeur</th></tr>
            </thead>
            <tbody>
              <tr><td><code>_ga</code></td><td>Identification de session unique (Google Analytics)</td><td>2 ans</td><td>Google LLC</td></tr>
              <tr><td><code>_ga_*</code></td><td>Conservation de l'état de session (Google Analytics 4)</td><td>2 ans</td><td>Google LLC</td></tr>
              <tr><td><code>_gid</code></td><td>Distinction des utilisateurs (durée courte)</td><td>24h</td><td>Google LLC</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12 }}>Google Analytics est configuré en mode anonymisation d'IP (IP masquée). Aucune donnée permettant d'identifier directement une personne n'est envoyée à Google. Pour plus d'informations : <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>Politique de confidentialité Google</a>.</p>

          <h3 style={{ marginTop: 28 }}>2.3 Cookies de paiement (consentement requis)</h3>
          <p>Lors d'un achat en ligne (e-book ou formation), Stripe dépose des cookies nécessaires à la sécurité de la transaction.</p>
          <table>
            <thead>
              <tr><th>Nom</th><th>Finalité</th><th>Durée</th><th>Éditeur</th></tr>
            </thead>
            <tbody>
              <tr><td><code>__stripe_mid</code></td><td>Prévention de la fraude</td><td>1 an</td><td>Stripe Inc.</td></tr>
              <tr><td><code>__stripe_sid</code></td><td>Session de paiement sécurisée</td><td>30 min</td><td>Stripe Inc.</td></tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: 28 }}>2.4 Cookies de réservation (Planity)</h3>
          <p>Si vous utilisez le module de réservation Planity intégré à notre site, Planity peut déposer ses propres cookies. Consultez la <a href="https://www.planity.com/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>politique de confidentialité Planity</a> pour plus d'informations.</p>
        </Section>

        <Section title="3. Durée de conservation">
          <p>Conformément aux recommandations de la CNIL :</p>
          <ul>
            <li>Les cookies de mesure d'audience ont une durée de vie maximale de <strong>13 mois</strong>.</li>
            <li>Les informations collectées via des cookies analytiques sont conservées maximum <strong>25 mois</strong>.</li>
            <li>Votre choix de consentement (accepter ou refuser) est conservé pendant <strong>6 mois</strong>, après quoi nous vous redemandons votre préférence.</li>
          </ul>
        </Section>

        <Section title="4. Gérer vos préférences cookies">
          <h3>4.1 Via notre bannière de consentement</h3>
          <p>Lors de votre première visite, une bannière vous invite à accepter ou refuser les cookies non essentiels. Vous pouvez modifier vos choix à tout moment en cliquant sur le lien « Gérer mes cookies » en bas de page.</p>

          <h3 style={{ marginTop: 20 }}>4.2 Via les paramètres de votre navigateur</h3>
          <p>Vous pouvez également contrôler les cookies directement via votre navigateur. Attention : désactiver certains cookies peut affecter le fonctionnement du site.</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>Safari (Mac)</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>Microsoft Edge</a></li>
          </ul>

          <h3 style={{ marginTop: 20 }}>4.3 Opposition aux cookies analytiques Google</h3>
          <p>Pour vous opposer au suivi par Google Analytics, vous pouvez installer le <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>module complémentaire de désactivation Google Analytics</a> disponible pour la plupart des navigateurs.</p>
        </Section>

        <Section title="5. Cookies tiers et réseaux sociaux">
          <p>
            Notre site peut contenir des liens vers Instagram (<a href="https://www.instagram.com/maisonmarialyon69" target="_blank" rel="noopener noreferrer" style={{ color: "#c4847a" }}>@maisonmarialyon69</a>). Instagram (Meta Platforms Ireland Ltd.) peut déposer ses propres cookies si vous êtes connecté à votre compte Instagram. Maison Maria n'a aucun contrôle sur ces cookies tiers.
          </p>
        </Section>

        <Section title="6. Modifications">
          <p>Maison Maria se réserve le droit de modifier la présente politique cookies à tout moment, notamment pour se conformer à d'éventuelles nouvelles réglementations. La date de mise à jour en bas de page fait foi.</p>
        </Section>

        <Section title="7. Contact">
          <p>Pour toute question concernant notre utilisation des cookies ou pour exercer vos droits :</p>
          <p style={{ marginTop: 8 }}>📧 <a href="mailto:contact@maison-maria.fr" style={{ color: "#c4847a" }}>contact@maison-maria.fr</a> · 📞 06 17 86 79 69</p>
          <p style={{ marginTop: 8 }}>Consulter aussi notre <Link href="/maison-maria/legal/confidentialite" style={{ color: "#c4847a" }}>Politique de Confidentialité</Link> pour les détails complets sur le traitement de vos données.</p>
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
          <Link key={l.key} href={l.href} style={{ fontSize: 12, color: l.key === active ? "#c4847a" : "#8a7570", textDecoration: "none", fontWeight: l.key === active ? 600 : 400 }}>
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
        section h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 500; color: #1a1412; margin: 0 0 8px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        th { background: #f7f2ea; padding: 10px 14px; text-align: left; font-weight: 600; color: #1a1412; border: 1px solid #ede4d6; }
        td { padding: 10px 14px; border: 1px solid #ede4d6; vertical-align: top; color: #5c4d48; }
        code { background: #f7f2ea; padding: 2px 6px; border-radius: 3px; font-size: 12px; color: #9d5f56; }
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
