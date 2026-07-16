import { LegalFooter } from "@/components/LegalFooter";
import { LegalEditeur, LegalHebergeur, LEGAL_FACTS } from "@/components/LegalIdentity";

export default function MentionsLegalesPage() {
  return (
    <>
      <main className="font-aevia-body max-w-4xl mx-auto px-4 sm:px-6 py-20 text-zinc-700 bg-white">
        <p className="text-xs text-zinc-500 mb-2">Dernière mise à jour : 17 mai 2026</p>
        <h1 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
          Mentions Légales
        </h1>
        <p className="text-zinc-700 text-sm mb-10 leading-relaxed">
          Conformément à la loi française n° 2004-575 du 21 juin 2004 pour la confiance
          dans l&apos;économie numérique (LCEN), les présentes mentions légales informent les
          visiteurs du site AeviaLaunch de l&apos;identité de l&apos;éditeur et des conditions
          d&apos;accès au service.
        </p>

        {/* ── 1. Éditeur ───────────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            1. Éditeur du site
          </h2>
          <LegalEditeur />
        </section>

        {/* ── 2. Description du service ──────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            2. Description du service
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-4">
            AeviaLaunch (launch.aevia.io) est une plateforme de création de sites web
            professionnels alliant génération de contenu par intelligence artificielle
            (Claude AI) et développement artisanal. Le service comprend :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 mb-4 ml-2">
            <li>Génération automatique du contenu (textes, structure) via l&apos;IA</li>
            <li>Sélection d&apos;un template de design professionnel</li>
            <li>Déploiement et mise en ligne du site sur Vercel</li>
            <li>Livraison en 7 jours ouvrés à compter de la réception complète des données</li>
          </ul>
          <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <strong className="text-zinc-900">Nature de la prestation :</strong> AeviaLaunch constitue
            une prestation de service combinant automatisation par IA et développement personnalisé.
            Le délai de livraison est 7 jours ouvrés après paiement et réception des informations complètes.
          </p>
        </section>

        {/* ── 3. Hébergeur ──────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            3. Hébergeur et infrastructure
          </h2>
          <LegalHebergeur />
        </section>

        {/* ── 4. Propriété intellectuelle ────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            4. Propriété intellectuelle et contenu
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            L&apos;ensemble de la plateforme AeviaLaunch (code source, interfaces, templates,
            algorithmes, designs) est la propriété exclusive d&apos;Aevia ou de ses partenaires.
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 ml-2 mb-4">
            <li>
              <strong className="text-zinc-900">Contenu généré :</strong> Le contenu généré par l&apos;IA
              pour votre site vous appartient en exclusivité après livraison et paiement intégral
            </li>
            <li>
              <strong className="text-zinc-900">Code du site :</strong> Vous recevez une licence
              perpétuelle d&apos;utilisation du code livré pour votre usage personnel
            </li>
            <li>
              <strong className="text-zinc-900">Templates :</strong> Les modèles de design Aevia
              sont fournis en licence — vous ne pouvez pas les revendre
            </li>
            <li>
              <strong className="text-zinc-900">Bibliothèques open-source :</strong> Soumises à leurs
              licences respectives (MIT, Apache 2.0, etc.)
            </li>
          </ul>
        </section>

        {/* ── 5. Tarification ───────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            5. Tarification et conditions commerciales
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-4">
            AeviaLaunch propose plusieurs formules de création de site web. Les tarifs sont
            affichés hors taxes. La TVA applicable est celle en vigueur au moment de la facturation
            selon la réglementation française.
          </p>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Le paiement intégral est requis avant le démarrage de la prestation. Les paiements
            sont traités par Stripe, plateforme de paiement certifiée PCI DSS niveau 1.
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <strong className="text-zinc-900">Satisfait ou remboursé :</strong> Vous disposez
            d&apos;un délai de 7 jours après livraison pour demander un remboursement complet si le
            résultat ne correspond pas à vos attentes, sans avoir à justifier.
          </p>
        </section>

        {/* ── 6. Responsabilité ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            6. Limitation de responsabilité
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Aevia s&apos;efforce de mettre à disposition les services avec la plus grande attention.
            Cependant, la responsabilité d&apos;Aevia est limitée comme suit :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 ml-2">
            <li>
              <strong className="text-zinc-900">Contenu généré par l&apos;IA :</strong> Le contenu généré
              automatiquement est fourni à titre de base de travail. Vous êtes seul responsable de
              vérifier l&apos;exactitude, la légalité et la pertinence avant publication
            </li>
            <li>
              <strong className="text-zinc-900">Disponibilité :</strong> Aevia n&apos;est pas responsable
              des interruptions de service chez Vercel ou des défaillances de l&apos;infrastructure
            </li>
            <li>
              <strong className="text-zinc-900">Dommages indirects :</strong> Aevia ne saurait être
              tenu responsable des pertes de données, pertes de chiffre d&apos;affaires ou dommages indirects
            </li>
            <li>
              <strong className="text-zinc-900">Conformité légale :</strong> Vous êtes responsable
              de la conformité de votre site avec les lois applicables (RGPD, données, accessibilité)
            </li>
          </ul>
        </section>

        {/* ── 7. Utilisation du service ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            7. Utilisations interdites
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Il est formellement interdit d&apos;utiliser AeviaLaunch pour :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 ml-2">
            <li>Créer des contenus illicites, haineux, discriminatoires ou diffamatoires</li>
            <li>Contourner les mesures de sécurité de la plateforme</li>
            <li>Utiliser la plateforme pour du spam ou du phishing</li>
            <li>Copier ou modifier le code source d&apos;AeviaLaunch sans autorisation</li>
            <li>Revendre ou sous-licencier l&apos;accès au service</li>
          </ul>
        </section>

        {/* ── 8. Contact et support ──────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            8. Contact et support
          </h2>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-sm space-y-2">
            <p className="text-zinc-900 font-semibold mb-2">Pour toute question ou réclamation :</p>
            <p className="text-zinc-700">
              <span className="text-zinc-900">Email :</span>{" "}
              <a href={`mailto:${LEGAL_FACTS.contactEmail}`} className="text-red-600 hover:text-red-700 transition-colors">
                {LEGAL_FACTS.contactEmail}
              </a>
            </p>
            <p className="text-zinc-700">
              <span className="text-zinc-900">Éditeur :</span> {LEGAL_FACTS.director} — {LEGAL_FACTS.editeur}, France
            </p>
            <p className="text-zinc-700">
              <span className="text-zinc-900">Politique de confidentialité :</span>{" "}
              <a href="/legal/confidentialite" className="text-red-600 hover:text-red-700 transition-colors">
                /legal/confidentialite
              </a>
            </p>
            <p className="text-zinc-700">
              <span className="text-zinc-900">CGU :</span>{" "}
              <a href="/legal/cgu" className="text-red-600 hover:text-red-700 transition-colors">
                /legal/cgu
              </a>
            </p>
          </div>
        </section>

        {/* ── 9. Droit applicable ────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
            9. Droit applicable et juridiction
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 mb-3">
            Les présentes mentions légales sont régies exclusivement par le droit français.
            En cas de litige, les parties s&apos;engagent à tenter une résolution amiable avant
            toute action judiciaire auprès des tribunaux français compétents.
          </p>
        </section>

        {/* Disclaimer */}
        <div className="mt-12 pt-6 border-t border-zinc-200">
          <p className="text-xs text-zinc-500 leading-relaxed italic">
            Ce document constitue les mentions légales officielles d&apos;AeviaLaunch, service édité
            par Aevia. Ces mentions ont été rédigées à titre informatif et de bonne foi. Pour
            tout conseil juridique spécifique à votre situation, consultez un avocat qualifié.
          </p>
        </div>
      </main>
      <LegalFooter variant="light" />
    </>
  )
}
