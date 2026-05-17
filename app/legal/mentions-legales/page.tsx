export default function MentionsLegalesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-zinc-300">
      <p className="text-xs text-zinc-500 mb-2">Dernière mise à jour : 17 mai 2026</p>
      <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
        Mentions Légales
      </h1>
      <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
        Conformément à la loi française n° 2004-575 du 21 juin 2004 pour la confiance
        dans l'économie numérique (LCEN), les présentes mentions légales informent les
        visiteurs du site AeviaLaunch de l'identité de l'éditeur et des conditions
        d'accès au service.
      </p>

      {/* ── 1. Éditeur ───────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          1. Éditeur du site
        </h2>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm space-y-1.5">
          <p>
            <span className="text-white font-semibold">AeviaLaunch</span> — service édité par Aevia
          </p>
          <p><span className="text-zinc-400">Entreprise :</span> Aevia — Entreprise individuelle (auto-entrepreneur)</p>
          <p><span className="text-zinc-400">Responsable légal :</span> Valentin Milliand</p>
          <p><span className="text-zinc-400">Statut :</span> Auto-entrepreneur, soumis au régime micro-entreprise</p>
          <p><span className="text-zinc-400">Pays d'établissement :</span> France</p>
          <p>
            <span className="text-zinc-400">Contact commercial :</span>{" "}
            <a href="mailto:hello@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              hello@aevia.io
            </a>
          </p>
          <p>
            <span className="text-zinc-400">Site principal :</span>{" "}
            <a href="https://aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              aevia.io
            </a>
          </p>
        </div>
      </section>

      {/* ── 2. Description du service ──────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          2. Description du service
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-4">
          AeviaLaunch (launch.aevia.io) est une plateforme de création de sites web
          professionnels alliant génération de contenu par intelligence artificielle
          (Claude AI) et développement artisanal. Le service comprend :
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1.5 mb-4 ml-2">
          <li>Génération automatique du contenu (textes, structure) via l'IA</li>
          <li>Sélection d'un template de design professionnel</li>
          <li>Déploiement et mise en ligne du site sur Vercel</li>
          <li>Livraison en 7 jours ouvrés à compter de la réception complète des données</li>
        </ul>
        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
          <strong className="text-zinc-300">Nature de la prestation :</strong> AeviaLaunch constitue
          une prestation de service combinant automatisation par IA et développement personnalisé.
          Le délai de livraison est 7 jours ouvrés après paiement et réception des informations complètes.
        </p>
      </section>

      {/* ── 3. Hébergeur ──────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-zinc-800">
          3. Hébergeur et infrastructure
        </h2>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm space-y-1.5">
          <p>
            <span className="text-white font-semibold">Vercel, Inc.</span>
          </p>
          <p><span className="text-zinc-400">URL :</span> https://vercel.com</p>
          <p><span className="text-zinc-400">Fonction :</span> Hébergement et déploiement des sites web générés</p>
          <p><span className="text-zinc-400">Localisation :</span> Serveurs mondialement distribués</p>
          <p>
            <span className="text-zinc-400">Politique de confidentialité :</span>{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </div>
      </section>

      {/* ── 4. Propriété intellectuelle ────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          4. Propriété intellectuelle et contenu
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          L'ensemble de la plateforme AeviaLaunch (code source, interfaces, templates,
          algorithmes, designs) est la propriété exclusive d'Aevia ou de ses partenaires.
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1.5 ml-2 mb-4">
          <li>
            <strong className="text-zinc-300">Contenu généré :</strong> Le contenu généré par l'IA
            pour votre site vous appartient en exclusivité après livraison et paiement intégral
          </li>
          <li>
            <strong className="text-zinc-300">Code du site :</strong> Vous recevez une licence
            perpétuelle d'utilisation du code livré pour votre usage personnel
          </li>
          <li>
            <strong className="text-zinc-300">Templates :</strong> Les modèles de design Aevia
            sont fournis en licence — vous ne pouvez pas les revendre
          </li>
          <li>
            <strong className="text-zinc-300">Bibliothèques open-source :</strong> Soumises à leurs
            licences respectives (MIT, Apache 2.0, etc.)
          </li>
        </ul>
      </section>

      {/* ── 5. Tarification ───────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          5. Tarification et conditions commerciales
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-4">
          AeviaLaunch propose plusieurs formules de création de site web. Les tarifs sont
          affichés hors taxes. La TVA applicable est celle en vigueur au moment de la facturation
          selon la réglementation française.
        </p>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Le paiement intégral est requis avant le démarrage de la prestation. Les paiements
          sont traités par Stripe, plateforme de paiement certifiée PCI DSS niveau 1.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/40 border border-zinc-800 rounded-lg p-4">
          <strong className="text-zinc-300">Satisfait ou remboursé :</strong> Vous disposez
          d'un délai de 7 jours après livraison pour demander un remboursement complet si le
          résultat ne correspond pas à vos attentes, sans avoir à justifier.
        </p>
      </section>

      {/* ── 6. Responsabilité ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          6. Limitation de responsabilité
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Aevia s'efforce de mettre à disposition les services avec la plus grande attention.
          Cependant, la responsabilité d'Aevia est limitée comme suit :
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1.5 ml-2">
          <li>
            <strong className="text-zinc-300">Contenu généré par l'IA :</strong> Le contenu généré
            automatiquement est fourni à titre de base de travail. Vous êtes seul responsable de
            vérifier l'exactitude, la légalité et la pertinence avant publication
          </li>
          <li>
            <strong className="text-zinc-300">Disponibilité :</strong> Aevia n'est pas responsable
            des interruptions de service chez Vercel ou des défaillances de l'infrastructure
          </li>
          <li>
            <strong className="text-zinc-300">Dommages indirects :</strong> Aevia ne saurait être
            tenu responsable des pertes de données, pertes de chiffre d'affaires ou dommages indirects
          </li>
          <li>
            <strong className="text-zinc-300">Conformité légale :</strong> Vous êtes responsable
            de la conformité de votre site avec les lois applicables (RGPD, données, accessibilité)
          </li>
        </ul>
      </section>

      {/* ── 7. Utilisation du service ─────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          7. Utilisations interdites
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Il est formellement interdit d'utiliser AeviaLaunch pour :
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1.5 ml-2">
          <li>Créer des contenus illicites, haineux, discriminatoires ou diffamatoires</li>
          <li>Contourner les mesures de sécurité de la plateforme</li>
          <li>Utiliser la plateforme pour du spam ou du phishing</li>
          <li>Copier ou modifier le code source d'AeviaLaunch sans autorisation</li>
          <li>Revendre ou sous-licencier l'accès au service</li>
        </ul>
      </section>

      {/* ── 8. Contact et support ──────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          8. Contact et support
        </h2>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm space-y-2">
          <p className="text-zinc-300 font-semibold mb-2">Pour toute question ou reclamation :</p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Email :</span>{" "}
            <a href="mailto:hello@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              hello@aevia.io
            </a>
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Éditeur :</span> Valentin Milliand — Aevia, France
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Politique de confidentialité :</span>{" "}
            <a href="/legal/confidentialite" className="text-violet-400 hover:text-violet-300 transition-colors">
              /legal/confidentialite
            </a>
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">CGU :</span>{" "}
            <a href="/legal/cgu" className="text-violet-400 hover:text-violet-300 transition-colors">
              /legal/cgu
            </a>
          </p>
        </div>
      </section>

      {/* ── 9. Droit applicable ────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          9. Droit applicable et juridiction
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Les présentes mentions légales sont régies exclusivement par le droit français.
          En cas de litige, les parties s'engagent à tenter une résolution amiable avant
          toute action judiciaire auprès des tribunaux français compétents.
        </p>
      </section>

      {/* Disclaimer */}
      <div className="mt-12 pt-6 border-t border-zinc-800/60">
        <p className="text-xs text-zinc-600 leading-relaxed italic">
          Ce document constitue les mentions légales officielles d'AeviaLaunch, service édité
          par Aevia. Ces mentions ont été rédigées à titre informatif et de bonne foi. Pour
          tout conseil juridique spécifique à votre situation, consultez un avocat qualifié.
        </p>
      </div>
    </main>
  )
}
