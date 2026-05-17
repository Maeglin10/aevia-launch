export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-zinc-300">
      <p className="text-xs text-zinc-500 mb-2">Dernière mise à jour : 17 mai 2026</p>
      <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
        Politique de Cookies
      </h1>
      <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
        La présente Politique de Cookies explique comment AeviaLaunch utilise les cookies
        et traceurs, conformément à la directive ePrivacy (2002/58/CE révisée), au RGPD et
        aux recommandations de la CNIL (Commission Nationale de l'Informatique et des Libertés).
      </p>

      {/* ── 1. Qu'est-ce qu'un cookie ? ──────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          1. Qu'est-ce qu'un cookie ?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite
          d'un site web. Il permet au site de mémoriser des informations sur votre visite
          et de personnaliser votre expérience.
        </p>
        <p className="text-sm leading-relaxed text-zinc-400">
          Les cookies peuvent être de session (supprimés à la fermeture du navigateur) ou
          persistants (conservés sur votre terminal). Ils peuvent être propriétaires (déposés
          directement par AeviaLaunch) ou tiers (déposés par des services intégrés).
        </p>
      </section>

      {/* ── 2. Catégories de cookies ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          2. Catégories de cookies utilisés
        </h2>

        {/* 2.1 Cookies strictement nécessaires */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-base font-semibold text-white">
              2.1 Cookies strictement nécessaires
            </h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
              Aucun consentement requis
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400 mb-4">
            Ces cookies sont indispensables au fonctionnement d'AeviaLaunch. Conformément à la
            réglementation CNIL, leur dépôt ne nécessite pas votre consentement préalable.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2.5 pr-4 text-zinc-300 font-semibold">Nom du cookie</th>
                  <th className="text-left py-2.5 pr-4 text-zinc-300 font-semibold">Finalité</th>
                  <th className="text-left py-2.5 text-zinc-300 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">accessToken</td>
                  <td className="py-2.5 pr-4">
                    Authentification — jeton JWT de session utilisateur connecté
                  </td>
                  <td className="py-2.5">Session (fermeture navigateur)</td>
                </tr>
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">__Secure-session</td>
                  <td className="py-2.5 pr-4">
                    Maintien de la session serveur (HttpOnly, Secure, SameSite=Strict)
                  </td>
                  <td className="py-2.5">Session</td>
                </tr>
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">csrf-token</td>
                  <td className="py-2.5 pr-4">
                    Protection contre les attaques CSRF (Cross-Site Request Forgery)
                  </td>
                  <td className="py-2.5">Session</td>
                </tr>
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">locale</td>
                  <td className="py-2.5 pr-4">Mémorisation de la langue sélectionnée</td>
                  <td className="py-2.5">1 an</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono">cookie-consent</td>
                  <td className="py-2.5 pr-4">Mémorisation des préférences de consentement</td>
                  <td className="py-2.5">13 mois</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2.2 Cookies analytiques */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-base font-semibold text-white">
              2.2 Cookies analytiques et de mesure d'audience
            </h3>
            <span className="text-xs text-sky-400 bg-sky-500/10 ring-1 ring-sky-500/20 px-2 py-0.5 rounded-full shrink-0">
              Sans consentement (Plausible)
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400 mb-3">
            AeviaLaunch utilise <strong className="text-zinc-300">Plausible Analytics</strong>,
            un outil de mesure d'audience respectueux de la vie privée qui :
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1 mb-3 ml-2">
            <li>Ne dépose <strong className="text-zinc-300">aucun cookie</strong></li>
            <li>Ne collecte pas d'adresses IP complètes</li>
            <li>Ne suit pas les utilisateurs d'un site à l'autre</li>
            <li>Fonctionne avec des données <strong className="text-zinc-300">100% anonymisées</strong></li>
            <li>Héberge les données en Europe (Allemagne)</li>
            <li>Est conforme au RGPD sans bandeau de consentement selon la CNIL</li>
          </ul>
        </div>

        {/* 2.3 Cookies tiers - Stripe */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-base font-semibold text-white">
              2.3 Cookies tiers — Stripe (Paiements)
            </h3>
            <span className="text-xs text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
              Consentement requis
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400 mb-3">
            Lors du paiement, Stripe dépose des cookies nécessaires au traitement sécurisé des
            transactions et à la prévention de la fraude. Ces cookies sont uniquement actifs
            pendant le processus de paiement.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2.5 pr-4 text-zinc-300 font-semibold">Nom</th>
                  <th className="text-left py-2.5 pr-4 text-zinc-300 font-semibold">Finalité</th>
                  <th className="text-left py-2.5 text-zinc-300 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">__stripe_mid</td>
                  <td className="py-2.5 pr-4">Identifiant de navigateur pour détection de fraude</td>
                  <td className="py-2.5">1 an</td>
                </tr>
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">__stripe_sid</td>
                  <td className="py-2.5 pr-4">Identifiant de session pour sécurité des transactions</td>
                  <td className="py-2.5">30 minutes</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono">m</td>
                  <td className="py-2.5 pr-4">Prévention de la fraude (empreinte navigateur)</td>
                  <td className="py-2.5">2 ans</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2.4 localStorage */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-base font-semibold text-white">
              2.4 Stockage local (localStorage)
            </h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
              Fonctionnel — nécessaire
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400 mb-3">
            AeviaLaunch utilise le stockage local du navigateur pour améliorer les performances :
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2.5 pr-4 text-zinc-300 font-semibold">Clé</th>
                  <th className="text-left py-2.5 pr-4 text-zinc-300 font-semibold">Finalité</th>
                  <th className="text-left py-2.5 text-zinc-300 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">aevia-theme</td>
                  <td className="py-2.5 pr-4">Préférence de thème (clair/sombre)</td>
                  <td className="py-2.5">Persistant</td>
                </tr>
                <tr className="border-b border-zinc-800/60">
                  <td className="py-2.5 pr-4 font-mono">aevia-draft-form</td>
                  <td className="py-2.5 pr-4">Sauvegarde automatique du formulaire de création</td>
                  <td className="py-2.5">Session</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono">aevia-launch-progress</td>
                  <td className="py-2.5 pr-4">État de progression du site en création</td>
                  <td className="py-2.5">30 jours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 3. Base légale ───────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          3. Base légale et consentement
        </h2>
        <div className="space-y-4 text-sm">
          <div className="bg-zinc-900/40 border border-emerald-800/40 rounded-xl p-5">
            <p className="font-semibold text-emerald-400 mb-2">
              Cookies exemptés de consentement (Article 82 de la loi Informatique et Libertés)
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Les cookies strictement nécessaires et les outils de mesure d'audience utilisant
              des données anonymisées (Plausible) sont exemptés de consentement préalable selon
              les lignes directrices de la CNIL du 17 septembre 2020.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-amber-800/40 rounded-xl p-5">
            <p className="font-semibold text-amber-400 mb-2">
              Cookies soumis à consentement (RGPD Art. 6.1.a)
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Les cookies tiers (Stripe) nécessitent votre consentement préalable. Ce consentement
              est recueilli via notre bandeau d'information cookies. Vous pouvez retirer votre
              consentement à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Gestion des cookies ───────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          4. Comment gérer vos préférences de cookies
        </h2>

        <h3 className="text-base font-semibold text-white mb-2 mt-4">4.1 Via notre gestionnaire</h3>
        <p className="text-sm leading-relaxed text-zinc-400 mb-4">
          Vous pouvez modifier vos préférences en cliquant sur &laquo; Gérer mes cookies &raquo;
          dans le pied de page.
        </p>

        <h3 className="text-base font-semibold text-white mb-2 mt-4">4.2 Via votre navigateur</h3>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies. Notez que
          la désactivation des cookies nécessaires peut altérer votre accès à AeviaLaunch.
        </p>
      </section>

      {/* ── 5. Contact ──────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          5. Contact
        </h2>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm space-y-2">
          <p className="text-zinc-300 font-semibold mb-2">
            Pour toute question concernant les cookies :
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Email :</span>{" "}
            <a href="mailto:privacy@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              privacy@aevia.io
            </a>
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Responsable :</span> Valentin Milliand — Aevia, France
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="mt-12 pt-6 border-t border-zinc-800/60">
        <p className="text-xs text-zinc-600 leading-relaxed italic">
          Ce document est publié à titre informatif et constitue la politique de cookies
          effective d'AeviaLaunch. Cette politique a été rédigée en conformité avec les exigences
          de la CNIL et du RGPD. Pour tout conseil juridique spécifique, consultez un expert qualifié.
        </p>
      </div>
    </main>
  )
}
