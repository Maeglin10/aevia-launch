import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Maison Maria",
  description: "Mentions légales de Maison Maria, institut de beauté à Vénissieux (69200).",
  robots: { index: false, follow: false },
};

const C = {
  bg: "#fdfaf5",
  dark: "#1a1412",
  rose: "#c4847a",
  roseDark: "#9d5f56",
  ivory: "#f7f2ea",
  ivoryDark: "#ede4d6",
  textMuted: "#8a7570",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'DM Sans', system-ui, sans-serif",
};

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/maison-maria/legal/mentions-legales" },
  { label: "CGV", href: "/maison-maria/legal/cgv" },
  { label: "Confidentialité", href: "/maison-maria/legal/confidentialite" },
  { label: "Cookies", href: "/maison-maria/legal/cookies" },
];

export default function MentionsLegalesPage() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.fontSans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        h2 { font-family: ${C.font}; }
      `}</style>

      {/* Mini nav */}
      <nav style={{ borderBottom: `1px solid ${C.ivoryDark}`, padding: "0 clamp(20px,6vw,80px)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/maison-maria" style={{ fontFamily: C.font, fontSize: 22, color: C.dark, textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: C.textMuted }}>←</span>
          Maison Maria
        </Link>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={{ fontFamily: C.fontSans, fontSize: 12, color: l.href.includes("mentions") ? C.rose : C.textMuted, textDecoration: "none", letterSpacing: "0.05em", fontWeight: l.href.includes("mentions") ? 600 : 400 }}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(24px,6vw,48px)" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.rose, marginBottom: 12, fontWeight: 500 }}>Informations légales</div>
          <h1 style={{ fontFamily: C.font, fontSize: "clamp(40px,6vw,72px)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: 20 }}>
            Mentions légales
          </h1>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>En vigueur au 1er juin 2026 · Conformes à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)</p>
        </div>

        <Section title="1. Éditeur du site">
          <p>Le présent site est édité par :</p>
          <ul>
            <li><strong>Raison sociale :</strong> Maison Maria — Entreprise individuelle</li>
            <li><strong>Fondatrice :</strong> Maria (auto-entrepreneuse, régime micro-entrepreneur)</li>
            <li><strong>Adresse :</strong> 10 Rue Jean-Baptiste Clément, 69200 Vénissieux, France</li>
            <li><strong>Téléphone :</strong> 06 17 86 79 69</li>
            <li><strong>Adresse e-mail :</strong> contact@maison-maria.fr</li>
            <li><strong>Activité :</strong> Institut de beauté — NAF/APE 9602B (Soins de beauté)</li>
          </ul>
          <p style={{ marginTop: 16 }}>
            Maison Maria est enregistrée auprès de la Chambre des Métiers et de l'Artisanat de la métropole de Lyon.
            L'utilisation de ce site implique l'acceptation pleine et entière des conditions d'utilisation décrites ci-après.
          </p>
        </Section>

        <Section title="2. Directrice de la publication">
          <p>La directrice de la publication est <strong>Maria</strong>, fondatrice de Maison Maria.</p>
        </Section>

        <Section title="3. Hébergement">
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Société :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
            <li><strong>Site :</strong> <a href="https://vercel.com" rel="noopener noreferrer" target="_blank" style={{ color: C.rose }}>vercel.com</a></li>
          </ul>
        </Section>

        <Section title="4. Propriété intellectuelle">
          <p>
            L'ensemble du contenu de ce site — textes, photographies, logos, vidéos, illustrations, charte graphique, base de données — est la propriété exclusive de Maison Maria ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
          </p>
          <p style={{ marginTop: 12 }}>
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Maison Maria. Toute exploitation non autorisée du site ou de l'un quelconque de ces éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
          </p>
        </Section>

        <Section title="5. Limitation de responsabilité">
          <p>
            Maison Maria ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications, soit de l'apparition d'un bug ou d'une incompatibilité.
          </p>
          <p style={{ marginTop: 12 }}>
            Les informations contenues sur ce site sont données à titre indicatif. Maison Maria se réserve le droit de les modifier à tout moment. De plus, l'utilisateur du site s'engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis à jour.
          </p>
        </Section>

        <Section title="6. Liens hypertextes">
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau internet. Ces liens sont fournis à titre informatif. Maison Maria n'exerce aucun contrôle sur ces sites tiers et n'assume aucune responsabilité quant à leur contenu, à leur fonctionnement ou à leur accessibilité.
          </p>
        </Section>

        <Section title="7. Données personnelles et cookies">
          <p>
            La collecte et le traitement de vos données personnelles sont régis par notre{" "}
            <Link href="/maison-maria/legal/confidentialite" style={{ color: C.rose }}>Politique de Confidentialité</Link>
            {" "}et notre{" "}
            <Link href="/maison-maria/legal/cookies" style={{ color: C.rose }}>Politique Cookies</Link>.
          </p>
          <p style={{ marginTop: 12 }}>
            Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@maison-maria.fr" style={{ color: C.rose }}>contact@maison-maria.fr</a>.
          </p>
          <p style={{ marginTop: 12 }}>
            En cas de litige, vous pouvez également adresser une réclamation à la CNIL (Commission Nationale de l'Informatique et des Libertés) — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: C.rose }}>cnil.fr</a>.
          </p>
        </Section>

        <Section title="8. Droit applicable et juridiction compétente">
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux du ressort de la Cour d'appel de Lyon seront seuls compétents.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter :<br />
            📧 <a href="mailto:contact@maison-maria.fr" style={{ color: C.rose }}>contact@maison-maria.fr</a><br />
            📞 <a href="tel:+33617867969" style={{ color: C.rose }}>06 17 86 79 69</a><br />
            📍 10 Rue Jean-Baptiste Clément, 69200 Vénissieux
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 500, color: "#1a1412", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #ede4d6" }}>
        {title}
      </h2>
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 15, lineHeight: 1.85, color: "#5c4d48" }}>
        {children}
      </div>
      <style>{`section p { margin: 0; } section ul { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 6px; }`}</style>
    </section>
  );
}

function LegalFooter() {
  return (
    <footer style={{ background: "#120e0c", padding: "40px clamp(20px,6vw,80px)", marginTop: 0 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: "rgba(255,255,255,0.8)" }}>Maison Maria</span>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Mentions légales", href: "/maison-maria/legal/mentions-legales" },
            { label: "CGV", href: "/maison-maria/legal/cgv" },
            { label: "Confidentialité", href: "/maison-maria/legal/confidentialite" },
            { label: "Cookies", href: "/maison-maria/legal/cookies" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.05em" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
