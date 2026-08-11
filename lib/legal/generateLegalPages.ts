import type { BusinessProfile, FormData } from "@/lib/sessions";
import { cgvForArchetype, legalArchetypeForNiche } from "@/lib/legal/legalArchetypes";

export interface LegalPages {
  mentionsLegales: string;
  cgv: string;
  confidentialite: string;
  cgu: string;
  cookies: string;
}

type Legal = BusinessProfile["legal"];

// Small helper: renders a clause only when its value is present, so an
// absent optional field (e.g. no capitalSocial for an auto-entreprise)
// disappears from the document instead of printing "undefined".
function clause(value: string | undefined, render: (v: string) => string): string {
  return value ? render(value) : "";
}

// Client-supplied identity (business name, SIRET, address…) is interpolated
// into HTML strings rendered with dangerouslySetInnerHTML downstream. Escape it
// at the source so a `<` or a pasted <script> in the wizard can never execute on
// the delivered site. Applied once to each field below → every interpolation is
// safe without touching the templates.
function esc(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
const escOpt = (v: string | undefined): string | undefined => (v ? esc(v) : v);

// Template-string generation from captured legal data — no AI call needed,
// these are boilerplate legal structures with fields substituted in. Mirrors
// the hand-written maison-maria legal pages already shipped
// (app/maison-maria/legal/*) for section structure and tone.
export function generateLegalPages(fd: FormData, legal: Legal, niche?: string): LegalPages {
  const businessName = esc(fd.businessName || "Cette entreprise");
  const email = esc(fd.email || "");
  const legalForm = escOpt(legal?.legalForm);
  const siret = escOpt(legal?.siret);
  const companyAddress = escOpt(legal?.companyAddress);
  const capitalSocial = escOpt(legal?.capitalSocial);

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

  // CGV is the one document whose clauses genuinely change by activity (right
  // of withdrawal, deposit, delivery) — so it is generated per legal archetype
  // derived from the business niche. Mentions/confidentialité/CGU below stay
  // generic (they do not vary meaningfully by sector).
  const cgv = cgvForArchetype(
    legalArchetypeForNiche(niche, fd.businessType),
    { name: businessName, identity },
  );

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
${
    fd.ga4Id
      ? `
    <h2>6. Cookies et mesure d'audience</h2>
    <p>Ce site utilise des cookies de mesure d'audience (Google Analytics) afin d'analyser sa fréquentation. Ces cookies ne sont déposés qu'après votre consentement, recueilli via le bandeau affiché lors de votre première visite, et vous pouvez les refuser sans que cela n'altère l'accès au site. Les cookies strictement nécessaires au fonctionnement du site ne requièrent pas de consentement.</p>`
      : ""
  }
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

  /*
    Politique de cookies — document distinct, et non un paragraphe des mentions
    légales : un site qui dépose Google Analytics doit décrire chaque traceur,
    sa finalité et sa durée, et dire comment revenir sur son choix.

    Le texte décrit le comportement RÉEL de TemplateAnalytics.tsx, pas un
    comportement souhaitable :
      — sans identifiant GA4, aucun bandeau et aucun traceur de mesure : la
        section correspondante disparaît du document ;
      — le choix du visiteur est retenu dans le stockage local sous
        « site-analytics-consent », ce qui n'est pas un cookie — l'écrire
        autrement serait faux ;
      — le bandeau ne réapparaît pas une fois répondu. On indique donc la seule
        marche qui fonctionne aujourd'hui : effacer les données du site. Promettre
        un réglage qui n'existe pas serait pire que de ne rien promettre.
  */
  const cookies = `
    <h2>1. Qu'est-ce qu'un cookie ?</h2>
    <p>Un cookie est un petit fichier déposé sur votre appareil lors de la consultation d'un site. Il permet au site de fonctionner, de mémoriser vos choix ou, pour certains d'entre eux, de mesurer la fréquentation. Cette politique décrit les traceurs utilisés sur le site de ${businessName}.</p>

    <h2>2. Cookies strictement nécessaires</h2>
    <p>Ces traceurs sont indispensables au fonctionnement du site : maintien de votre session pendant la navigation, sécurité et prévention des abus, mémorisation de vos préférences d'affichage. Ils ne servent à aucune mesure d'audience ni à de la publicité.</p>
    <p>Conformément à l'article 82 de la loi Informatique et Libertés, ils sont déposés <strong>sans votre consentement préalable</strong>, car strictement nécessaires à la fourniture du service que vous demandez. Ils sont conservés le temps de votre visite, ou au plus douze mois pour les préférences d'affichage.</p>
${
    fd.ga4Id
      ? `
    <h2>3. Mesure d'audience — Google Analytics 4</h2>
    <p>Ce site utilise Google Analytics 4 pour comprendre sa fréquentation : nombre de visiteurs, pages consultées, provenance. Ces traceurs <strong>ne sont déposés qu'après votre accord explicite</strong>, recueilli par le bandeau affiché lors de votre première visite. Tant que vous n'avez pas répondu, aucun traceur de mesure n'est chargé.</p>
    <p><strong>Refuser n'altère rien</strong> : l'intégralité du site reste accessible et fonctionne à l'identique.</p>
    <ul>
      <li><strong>_ga</strong> — distingue les visiteurs. Durée : 13 mois.</li>
      <li><strong>_ga_*</strong> — maintient l'état de la session de mesure. Durée : 13 mois.</li>
    </ul>
    <p>Ces données sont traitées par Google Ireland Limited. Elles servent uniquement à produire des statistiques de fréquentation et ne sont pas utilisées pour vous adresser de la publicité depuis ce site.</p>

    <h2>4. Votre choix, et comment en changer</h2>
    <p>Votre réponse au bandeau est mémorisée dans le stockage local de votre navigateur, sous la clé <code>site-analytics-consent</code>. Il ne s'agit pas d'un cookie et cette information ne quitte jamais votre appareil.</p>
    <p>Le bandeau n'est présenté qu'une fois. Pour revenir sur votre décision, effacez les données de navigation associées à ce site depuis les réglages de votre navigateur : le bandeau vous sera de nouveau proposé à la visite suivante. Vous pouvez également paramétrer votre navigateur pour refuser les traceurs de manière générale.</p>

    <h2>5. Durées de conservation</h2>
    <p>Les traceurs de mesure d'audience expirent au plus tard treize mois après leur dépôt et ne sont pas prolongés à votre retour sur le site. Les statistiques qui en découlent sont conservées vingt-cinq mois au maximum, conformément aux recommandations de la CNIL.</p>

    <h2>6. En savoir plus</h2>`
      : `
    <h2>3. Absence de mesure d'audience</h2>
    <p>Ce site ne dépose aucun traceur de mesure d'audience, de statistiques ou de publicité. Aucun bandeau de consentement n'est donc affiché : il n'y a rien à accepter ou à refuser.</p>

    <h2>4. Durées de conservation</h2>
    <p>Les seuls traceurs présents étant strictement nécessaires, ils disparaissent à la fin de votre session ou au plus tard douze mois après leur dépôt.</p>

    <h2>5. En savoir plus</h2>`
  }
    <p>Le traitement de vos données personnelles est détaillé dans notre <a href="./confidentialite">Politique de confidentialité</a>.${email ? ` Pour toute question relative aux traceurs, écrivez-nous à : ${email}.` : ""} Vous pouvez adresser une réclamation à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).</p>
  `.trim();

  return { mentionsLegales, cgv, confidentialite, cgu, cookies };
}
