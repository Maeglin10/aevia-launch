import type { BusinessProfile, FormData } from "@/lib/sessions";

export interface LegalPages {
  mentionsLegales: string;
  cgv: string;
  confidentialite: string;
  cgu: string;
}

type Legal = BusinessProfile["legal"];

// Small helper: renders a clause only when its value is present, so an
// absent optional field (e.g. no capitalSocial for an auto-entreprise)
// disappears from the document instead of printing "undefined".
function clause(value: string | undefined, render: (v: string) => string): string {
  return value ? render(value) : "";
}

// Template-string generation from captured legal data — no AI call needed,
// these are boilerplate legal structures with fields substituted in. Mirrors
// the hand-written maison-maria legal pages already shipped
// (app/maison-maria/legal/*) for section structure and tone.
export function generateLegalPages(fd: FormData, legal: Legal): LegalPages {
  const businessName = fd.businessName || "Cette entreprise";
  const email = fd.email || "";
  const legalForm = legal?.legalForm;
  const siret = legal?.siret;
  const companyAddress = legal?.companyAddress;
  const capitalSocial = legal?.capitalSocial;

  const identity = `
    <ul>
      <li><strong>Raison sociale :</strong> ${businessName}${legalForm ? ` — ${legalForm}` : ""}</li>
      ${clause(siret, (v) => `<li><strong>SIRET :</strong> ${v}</li>`)}
      ${clause(companyAddress, (v) => `<li><strong>Adresse :</strong> ${v}</li>`)}
      ${clause(capitalSocial, (v) => `<li><strong>Capital social :</strong> ${v}</li>`)}
      ${email ? `<li><strong>Adresse e-mail :</strong> ${email}</li>` : ""}
    </ul>
  `.trim();

  const mentionsLegales = `
    <h2>1. Éditeur du site</h2>
    <p>Le présent site est édité par :</p>
    ${identity}

    <h2>2. Directeur de la publication</h2>
    <p>Le directeur de la publication est le représentant légal de ${businessName}.</p>

    <h2>3. Hébergement</h2>
    <p>Le site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis (<a href="https://vercel.com">vercel.com</a>).</p>

    <h2>4. Propriété intellectuelle</h2>
    <p>L'ensemble du contenu de ce site — textes, photographies, logos, charte graphique — est la propriété exclusive de ${businessName} ou de ses partenaires, protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>

    <h2>5. Données personnelles et cookies</h2>
    <p>La collecte et le traitement de vos données personnelles sont régis par notre Politique de Confidentialité, conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).${email ? ` Pour exercer vos droits, contactez-nous à : ${email}.` : ""}</p>

    <h2>6. Droit applicable</h2>
    <p>Les présentes mentions légales sont régies par le droit français.</p>
  `.trim();

  const cgv = `
    <h2>1. Identification du vendeur</h2>
    ${identity}

    <h2>2. Prestations</h2>
    <p>${businessName} propose à la vente les prestations et produits décrits sur le présent site. Les descriptions et prix affichés font foi au moment de la commande.</p>

    <h2>3. Prix et modalités de paiement</h2>
    <p>Les prix sont indiqués en euros, toutes taxes comprises le cas échéant. Le paiement s'effectue selon les modalités précisées lors de la commande ou de la prise de rendez-vous.</p>

    <h2>4. Droit de rétractation</h2>
    <p>Conformément à la législation en vigueur, un droit de rétractation peut s'appliquer selon la nature de la prestation commandée.</p>

    <h2>5. Responsabilité</h2>
    <p>${businessName} s'engage à exécuter ses prestations avec soin et diligence, sans garantie de résultat au-delà de ce qui est explicitement décrit.</p>

    <h2>6. Droit applicable</h2>
    <p>Les présentes conditions générales de vente sont soumises au droit français.</p>
  `.trim();

  const confidentialite = `
    <h2>1. Responsable du traitement</h2>
    <p>${businessName}${companyAddress ? `, ${companyAddress}` : ""}, est responsable du traitement des données personnelles collectées sur ce site.</p>

    <h2>2. Données collectées</h2>
    <p>Les données collectées se limitent à celles nécessaires au traitement de vos demandes : nom, coordonnées, et le cas échéant informations liées à une réservation ou un devis.</p>

    <h2>3. Finalités et base légale</h2>
    <p>Ces données sont utilisées pour répondre à vos demandes et gérer la relation commerciale, sur la base de votre consentement ou de l'exécution d'un contrat.</p>

    <h2>4. Durée de conservation</h2>
    <p>Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, conformément aux obligations légales applicables.</p>

    <h2>5. Vos droits</h2>
    <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition concernant vos données personnelles.${email ? ` Pour exercer ces droits, contactez-nous à : ${email}.` : ""} Vous pouvez également adresser une réclamation à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).</p>
  `.trim();

  const cgu = `
    <h2>1. Objet</h2>
    <p>Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation du site de ${businessName}.</p>

    <h2>2. Acceptation</h2>
    <p>L'accès au site implique l'acceptation pleine et entière des présentes conditions générales d'utilisation.</p>

    <h2>3. Accès au site</h2>
    <p>${businessName} s'efforce de permettre l'accès au site 24h/24, 7j/7, sauf interruption pour maintenance ou cas de force majeure.</p>

    <h2>4. Propriété intellectuelle</h2>
    <p>Le contenu du site est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.</p>

    <h2>5. Modification des CGU</h2>
    <p>${businessName} se réserve le droit de modifier les présentes conditions générales d'utilisation à tout moment.</p>

    <h2>6. Droit applicable</h2>
    <p>Les présentes conditions générales d'utilisation sont soumises au droit français.</p>
  `.trim();

  return { mentionsLegales, cgv, confidentialite, cgu };
}
