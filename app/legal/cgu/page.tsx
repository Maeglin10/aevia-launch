import { LegalFooter } from "@/components/LegalFooter";
import { LegalEditeur, LEGAL_FACTS } from "@/components/LegalIdentity";

export default function CGUPage() {
  return (
    <>
      <main className="font-aevia-body max-w-4xl mx-auto px-4 sm:px-6 py-20 text-zinc-700 bg-white">
        <p className="text-xs text-zinc-500 mb-2">Dernière mise à jour : 17 mai 2026</p>
        <h1 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
          Conditions Générales d&apos;Utilisation et de Vente
        </h1>
        <p className="text-zinc-700 text-sm mb-10 leading-relaxed">
          Les présentes Conditions Générales d&apos;Utilisation et de Vente (CGU/CGV) régissent
          l&apos;accès et l&apos;utilisation du service AeviaLaunch ainsi que les relations commerciales
          entre Aevia et ses clients. En accédant au service, vous acceptez sans réserve les
          présentes conditions.
        </p>

        {/* ── 1. Éditeur ───────────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            1. Éditeur du service
          </h2>
          <LegalEditeur />
        </section>

        {/* ── 2. Description du service ──────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            2. Description du service AeviaLaunch
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            AeviaLaunch est une plateforme de création de sites web professionnels assistée
            par intelligence artificielle. Le service comprend :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 mb-4 ml-2">
            <li>Formulaire interactif pour la collecte de vos informations (entreprise, secteur, description)</li>
            <li>Génération automatique du contenu web (textes, structure) via Claude AI</li>
            <li>Sélection d&apos;un template de design professionnel parmi 200+ modèles</li>
            <li>Développement et personnalisation du site</li>
            <li>Déploiement et mise en ligne sur Vercel</li>
            <li>Délai de livraison : 7 jours ouvrés après paiement et données complètes</li>
          </ul>
          <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <strong className="text-zinc-900">Nature de la prestation :</strong> AeviaLaunch constitue
            une prestation de service combinant automatisation par IA et développement artisanal. Le site
            livré est hébergé sur l&apos;infrastructure Vercel et reste votre propriété exclusive.
          </p>
        </section>

        {/* ── 3. Conditions d'accès ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            3. Conditions d&apos;accès et de compte
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            L&apos;accès à AeviaLaunch nécessite la création d&apos;un compte. En créant un compte,
            vous vous engagez à :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 mb-4 ml-2">
            <li>Fournir des informations exactes, complètes et à jour</li>
            <li>Maintenir la confidentialité de vos identifiants de connexion</li>
            <li>Notifier immédiatement Aevia de tout accès non autorisé</li>
            <li>Être âgé d&apos;au moins 18 ans ou représenter légalement une entité</li>
            <li>Utiliser le service conformément à la loi française et à la présente CGU</li>
          </ul>
        </section>

        {/* ── 4. Tarifs et paiement ────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            4. Tarifs et conditions de paiement
          </h2>

          <h3 className="text-base font-semibold text-zinc-900 mb-2 mt-4">4.1 Grille tarifaire</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-300">
                  <th className="text-left py-2 pr-4 text-zinc-900 font-semibold">Formule</th>
                  <th className="text-left py-2 pr-4 text-zinc-900 font-semibold">Tarif HT</th>
                  <th className="text-left py-2 text-zinc-900 font-semibold">Inclus</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700">
                <tr className="border-b border-zinc-200">
                  <td className="py-2 pr-4">Essentiel</td>
                  <td className="py-2 pr-4">599 €</td>
                  <td className="py-2">Site vitrine, 5 pages, déploiement</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-2 pr-4">Pro</td>
                  <td className="py-2 pr-4">899 €</td>
                  <td className="py-2">Site complet, blog, formulaires, SEO</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Business</td>
                  <td className="py-2 pr-4">1 499 €</td>
                  <td className="py-2">E-commerce, intégrations, SEO avancé</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-zinc-900 mb-2 mt-6">4.2 Modalités de paiement</h3>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Les paiements sont traités exclusivement par <strong className="text-zinc-900">Stripe</strong>,
            plateforme de paiement certifiée PCI DSS niveau 1. Les modes de paiement acceptés sont les
            cartes bancaires (Visa, Mastercard, American Express) et les prélèvements SEPA.
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 mb-4 ml-2">
            <li>Paiement intégral requis avant le démarrage de la prestation</li>
            <li>Tous les tarifs sont indiqués hors taxes (HT)</li>
            <li>La TVA applicable est celle en vigueur au moment de la facturation selon la réglementation française</li>
            <li>Une facture est émise après paiement et conservée 10 ans</li>
          </ul>
        </section>

        {/* ── 5. Droit de rétractation et remboursement ────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            5. Droit de rétractation et politique de remboursement
          </h2>

          <h3 className="text-base font-semibold text-zinc-900 mb-2 mt-4">5.1 Droit de rétractation légal</h3>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Conformément à l&apos;article L.221-18 du Code de la consommation (applicable aux
            personnes physiques n&apos;agissant pas à titre strictement professionnel), vous disposez
            d&apos;un <strong className="text-zinc-900">délai de 14 jours</strong> à compter de la
            souscription pour exercer votre droit de rétractation.
          </p>

          <h3 className="text-base font-semibold text-zinc-900 mb-2 mt-6">5.2 Politique de remboursement AeviaLaunch</h3>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Aevia propose une garantie &laquo; Satisfait ou remboursé &raquo; :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 mb-4 ml-2">
            <li>
              <strong className="text-zinc-900">Avant le démarrage :</strong> Remboursement intégral
              possible dans les 14 jours si aucun travail n&apos;a été entamé
            </li>
            <li>
              <strong className="text-zinc-900">Après livraison (7 jours) :</strong> Remboursement
              complet sans justification si le résultat ne vous satisfait pas
            </li>
            <li>
              <strong className="text-zinc-900">Après 7 jours de livraison :</strong> Aucun remboursement
              si le site a été publié et exploité
            </li>
            <li>
              En cas de renonciation au droit de rétractation (utilisation du site avant l&apos;expiration
              des 14 jours), cette renonciation est irrévocable
            </li>
          </ul>
        </section>

        {/* ── 6. Obligations du client ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            6. Obligations du Client
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Le Client s&apos;engage à :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 ml-2">
            <li>Fournir des informations exactes et complètes dans le formulaire de création</li>
            <li>Garantir disposer des droits sur tous les contenus transmis (textes, images, logos)</li>
            <li>Ne pas utiliser le service pour des fins illicites ou contraires à l&apos;ordre public</li>
            <li>Respecter la propriété intellectuelle des tiers et les lois applicables</li>
            <li>Mettre en œuvre les mesures de sécurité recommandées pour son site livré</li>
            <li>Accepter que le contenu généré par l&apos;IA est fourni à titre de base de travail</li>
          </ul>
        </section>

        {/* ── 7. Propriété intellectuelle ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            7. Propriété intellectuelle
          </h2>

          <h3 className="text-base font-semibold text-zinc-900 mb-2 mt-4">7.1 Droits d&apos;Aevia</h3>
          <p className="text-sm leading-relaxed text-zinc-700 mb-4">
            L&apos;ensemble de la plateforme AeviaLaunch (code source, interfaces, templates,
            algorithmes) est la propriété exclusive d&apos;Aevia ou de ses licenciaires.
          </p>

          <h3 className="text-base font-semibold text-zinc-900 mb-2 mt-4">7.2 Propriété du site livré</h3>
          <p className="text-sm leading-relaxed text-zinc-700 mb-2">
            À l&apos;issue du paiement intégral :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 ml-2">
            <li>
              Le <strong className="text-zinc-900">contenu généré</strong> (textes, structure, visuels)
              vous appartient en exclusivité
            </li>
            <li>
              Le <strong className="text-zinc-900">code source</strong> du site est transféré avec
              une licence d&apos;utilisation permanente et exclusive
            </li>
            <li>
              Les <strong className="text-zinc-900">templates Aevia</strong> sont licenciés pour votre
              usage propre mais ne peuvent être revendus
            </li>
            <li>
              Les <strong className="text-zinc-900">bibliothèques open-source</strong> restent soumises
              à leurs licences respectives (MIT, Apache 2.0, etc.)
            </li>
          </ul>
        </section>

        {/* ── 8. Responsabilité ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            8. Limitation de responsabilité
          </h2>
          <div className="space-y-3 text-sm">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <p className="font-semibold text-zinc-900 mb-1">Contenu généré par l&apos;IA</p>
              <p className="text-zinc-700 leading-relaxed">
                Le contenu généré automatiquement est fourni à titre de base de travail. Vous êtes
                seul responsable de vérifier l&apos;exactitude, la légalité et la pertinence avant publication.
                Aevia n&apos;assume aucune responsabilité pour les inexactitudes factuelles.
              </p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <p className="font-semibold text-zinc-900 mb-1">Disponibilité de Vercel</p>
              <p className="text-zinc-700 leading-relaxed">
                Aevia n&apos;est pas responsable des interruptions de service chez Vercel, de l&apos;indisponibilité
                du site ou des défaillances de l&apos;infrastructure hors de son contrôle.
              </p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <p className="font-semibold text-zinc-900 mb-1">Conformité légale</p>
              <p className="text-zinc-700 leading-relaxed">
                Vous êtes responsable de la conformité de votre site avec les lois applicables
                (RGPD, données, accessibilité, mentions légales, conditions commerciales).
              </p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <p className="font-semibold text-zinc-900 mb-1">Plafond d&apos;indemnisation</p>
              <p className="text-zinc-700 leading-relaxed">
                La responsabilité totale d&apos;Aevia ne peut excéder le montant versé au cours des
                12 derniers mois. Aevia ne saurait être tenu responsable des dommages indirects
                ou pertes de chiffre d&apos;affaires.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. Résiliation ───────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            9. Résiliation et clôture de compte
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Aevia peut suspendre ou résilier votre accès en cas de violation de la présente CGU,
            de comportement frauduleux, ou de non-paiement persistant. Après résiliation, vos données
            sont conservées 3 ans pour prescription commerciale, puis supprimées.
          </p>
        </section>

        {/* ── 10. Contact ──────────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            10. Contact et support
          </h2>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm space-y-2">
            <p className="text-zinc-900 font-semibold mb-2">Pour toute question relative aux CGU :</p>
            <p className="text-zinc-700">
              <span className="text-zinc-900">Email :</span>{" "}
              <a href={`mailto:${LEGAL_FACTS.contactEmail}`} className="text-red-600 hover:text-red-700 transition-colors">
                {LEGAL_FACTS.contactEmail}
              </a>
            </p>
            <p className="text-zinc-700">
              <span className="text-zinc-900">Éditeur :</span> {LEGAL_FACTS.director} — {LEGAL_FACTS.editeur}, France
            </p>
          </div>
        </section>

        {/* ── 11. Droit applicable ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            11. Droit applicable et juridiction
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700">
            Les présentes CGU/CGV sont régies par le <strong className="text-zinc-900">droit français</strong>.
            Tout litige sera soumis à la compétence exclusive des tribunaux français compétents. En cas
            de désaccord, les parties s&apos;engagent à tenter une résolution amiable préalablement.
          </p>
        </section>

        {/* Disclaimer */}
        <div className="mt-12 pt-6 border-t border-zinc-200">
          <p className="text-xs text-zinc-500 leading-relaxed italic">
            Ce document constitue les conditions générales d&apos;utilisation et de vente applicables à
            AeviaLaunch. Ces conditions ont été rédigées à titre informatif et de bonne foi. Pour tout
            conseil juridique spécifique, consultez un avocat qualifié.
          </p>
        </div>
      </main>
      <LegalFooter variant="light" />
    </>
  )
}
