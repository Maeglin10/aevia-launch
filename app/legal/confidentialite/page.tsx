export default function ConfidentialitePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-zinc-300">
      <p className="text-xs text-zinc-500 mb-2">Dernière mise à jour : 17 mai 2026</p>
      <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
        Politique de Confidentialité
      </h1>
      <p className="text-zinc-400 text-sm mb-10 leading-relaxed">
        La présente Politique de Confidentialité décrit la manière dont AeviaLaunch collecte,
        utilise, conserve et protège vos données personnelles conformément au Règlement Général
        sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi française
        Informatique et Libertés.
      </p>

      {/* ── 1. Responsable du traitement ─────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          1. Responsable du traitement
        </h2>
        <p className="mb-3 text-sm leading-relaxed">
          Le responsable du traitement de vos données personnelles est :
        </p>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm space-y-1">
          <p><span className="text-white font-semibold">Aevia</span> — Entreprise individuelle (auto-entrepreneur)</p>
          <p><span className="text-zinc-400">Responsable légal :</span> Valentin Milliand</p>
          <p><span className="text-zinc-400">Service concerné :</span> AeviaLaunch (launch.aevia.io)</p>
          <p>
            <span className="text-zinc-400">Contact :</span>{" "}
            <a href="mailto:hello@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              hello@aevia.io
            </a>
          </p>
          <p>
            <span className="text-zinc-400">Contact DPO / Vie privée :</span>{" "}
            <a href="mailto:privacy@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              privacy@aevia.io
            </a>
          </p>
        </div>
      </section>

      {/* ── 2. Données collectées ────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          2. Données personnelles collectées
        </h2>

        <h3 className="text-base font-semibold text-white mb-2 mt-5">2.1 Données de compte et d'identification</h3>
        <p className="text-sm leading-relaxed mb-3">
          Lors de la création d'un compte sur AeviaLaunch, nous collectons :
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1 mb-4 ml-2">
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Nom de l'entreprise</li>
          <li>Numéro de téléphone (optionnel)</li>
          <li>Adresse IP de connexion et informations de navigateur (User-Agent)</li>
          <li>Mot de passe (stocké sous forme de hash bcrypt, jamais en clair)</li>
        </ul>

        <h3 className="text-base font-semibold text-white mb-2 mt-5">2.2 Données de projet et de génération</h3>
        <p className="text-sm leading-relaxed mb-3">
          Pour la génération de votre site web, nous collectons les informations que vous
          renseignez dans le formulaire de création :
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1 mb-4 ml-2">
          <li>Secteur d'activité et description de votre activité</li>
          <li>Textes et contenus fournis (texte d'accueil, description, services, etc.)</li>
          <li>Préférences de design et charte graphique</li>
          <li>Fichiers uploadés (logos, images, photos)</li>
          <li>Contenu généré par l'IA à partir de vos informations</li>
        </ul>

        <h3 className="text-base font-semibold text-white mb-2 mt-5">2.3 Données de paiement</h3>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Les paiements sont traités exclusivement par <strong className="text-zinc-300">Stripe</strong>.
          AeviaLaunch ne collecte ni ne stocke jamais vos coordonnées bancaires. Nous ne conservons que les
          références de transaction Stripe, l'historique des commandes et les montants facturés.
        </p>

        <h3 className="text-base font-semibold text-white mb-2 mt-5">2.4 Données de suivi et d'utilisation</h3>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1 mb-4 ml-2">
          <li>Pages visitées, durée de session, actions effectuées</li>
          <li>Données d'étapes de création de site (formulaires complétés)</li>
          <li>Logs techniques (erreurs, performances)</li>
          <li>Statistiques d'usage via Plausible Analytics (anonymisées)</li>
        </ul>
      </section>

      {/* ── 3. Bases légales ────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          3. Bases légales des traitements (RGPD Art. 6)
        </h2>
        <div className="space-y-4 text-sm">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <p className="font-semibold text-white mb-1">Art. 6.1.b — Exécution du contrat</p>
            <p className="text-zinc-400 leading-relaxed">
              Traitement des données de compte et de projet nécessaires pour la création,
              la génération et la livraison de votre site web AeviaLaunch.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <p className="font-semibold text-white mb-1">Art. 6.1.c — Obligation légale</p>
            <p className="text-zinc-400 leading-relaxed">
              Conservation des données de facturation (10 ans conformément au Code de commerce
              français), lutte contre la fraude, obligations fiscales.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <p className="font-semibold text-white mb-1">Art. 6.1.f — Intérêt légitime</p>
            <p className="text-zinc-400 leading-relaxed">
              Amélioration de notre plateforme, sécurité technique, détection de comportements abusifs,
              statistiques d'usage agrégées.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <p className="font-semibold text-white mb-1">Art. 6.1.a — Consentement</p>
            <p className="text-zinc-400 leading-relaxed">
              Envoi de communications marketing et notifications de suivi de commande.
              Vous pouvez retirer votre consentement à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Durées de conservation ────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          4. Durées de conservation des données
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 pr-4 text-white font-semibold">Catégorie de données</th>
                <th className="text-left py-3 text-white font-semibold">Durée de conservation</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-800/60">
                <td className="py-3 pr-4">Données de compte (actif)</td>
                <td className="py-3">Durée de la relation contractuelle</td>
              </tr>
              <tr className="border-b border-zinc-800/60">
                <td className="py-3 pr-4">Données de compte (après suppression)</td>
                <td className="py-3">3 ans (prescription commerciale)</td>
              </tr>
              <tr className="border-b border-zinc-800/60">
                <td className="py-3 pr-4">Données de facturation et contrats</td>
                <td className="py-3">10 ans (obligation légale)</td>
              </tr>
              <tr className="border-b border-zinc-800/60">
                <td className="py-3 pr-4">Données de projet et fichiers uploadés</td>
                <td className="py-3">Livraison du site + 6 mois (support)</td>
              </tr>
              <tr className="border-b border-zinc-800/60">
                <td className="py-3 pr-4">Logs techniques</td>
                <td className="py-3">90 jours</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Données de prospection (consentement)</td>
                <td className="py-3">3 ans à compter du dernier contact</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. Destinataires et sous-traitants ──────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          5. Destinataires des données et sous-traitants
        </h2>
        <p className="text-sm leading-relaxed mb-5 text-zinc-400">
          AeviaLaunch ne vend jamais vos données personnelles. Nous faisons appel aux
          prestataires suivants, chacun lié par des garanties contractuelles conformes au RGPD :
        </p>
        <div className="space-y-4 text-sm">

          <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30">
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-white">Stripe, Inc.</p>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Paiements</span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-2">
              Traitement de tous les paiements par carte bancaire. Stripe est certifié PCI DSS niveau 1.
            </p>
            <p className="text-zinc-500 text-xs">
              Transfert international : États-Unis — Stripe adhère aux Clauses Contractuelles Types (CCT).
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30">
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-white">Anthropic, PBC</p>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">IA — Génération</span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-2">
              Traitement des données du formulaire pour la génération de contenu web via l'API Claude.
              Les données ne sont pas utilisées pour entraîner les modèles.
            </p>
            <p className="text-zinc-500 text-xs">
              Transfert international : États-Unis — Anthropic est soumis aux CCT.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30">
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-white">Render Services, Inc.</p>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Hébergement Backend</span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-2">
              Hébergement de l'API et des bases de données. Les données sont hébergées
              dans des datacenters situés en Oregon, USA.
            </p>
            <p className="text-zinc-500 text-xs">
              Transfert international : États-Unis — Render opère sous les CCT.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30">
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-white">Vercel, Inc.</p>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Hébergement Frontend</span>
            </div>
            <p className="text-zinc-400 leading-relaxed mb-2">
              Hébergement et distribution des sites web générés. Vercel agit comme CDN
              avec des nœuds de cache à travers le monde.
            </p>
            <p className="text-zinc-500 text-xs">
              Transfert international : États-Unis — Vercel est conforme aux CCT.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30">
            <div className="flex items-start justify-between mb-2">
              <p className="font-semibold text-white">Plausible Analytics</p>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Statistiques</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Mesure d'audience respectueuse de la vie privée. Plausible ne dépose pas de cookies,
              ne collecte pas d'adresses IP complètes et ne suit pas les utilisateurs. Les données
              sont hébergées en Europe (UE).
            </p>
          </div>

        </div>
      </section>

      {/* ── 6. Transferts internationaux ────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          6. Transferts de données hors Union européenne
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          Certains de nos sous-traitants (Stripe, Anthropic, Render, Vercel) sont
          établis aux États-Unis. Ces transferts sont encadrés par des{" "}
          <strong className="text-zinc-300">Clauses Contractuelles Types (CCT)</strong> adoptées
          par la Commission européenne, garantissant un niveau de protection équivalent à celui
          offert au sein de l'UE.
        </p>
      </section>

      {/* ── 7. Droits des personnes ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          7. Vos droits sur vos données personnelles
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-5">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
          {[
            {
              title: "Droit d'accès (Art. 15)",
              desc: "Obtenir une copie de vos données personnelles.",
            },
            {
              title: "Droit de rectification (Art. 16)",
              desc: "Corriger vos données inexactes ou incomplètes.",
            },
            {
              title: "Droit à l'effacement (Art. 17)",
              desc: "Demander la suppression de vos données.",
            },
            {
              title: "Droit à la portabilité (Art. 20)",
              desc: "Recevoir vos données dans un format lisible.",
            },
            {
              title: "Droit d'opposition (Art. 21)",
              desc: "Vous opposer au traitement à fins de prospection.",
            },
            {
              title: "Droit à la limitation (Art. 18)",
              desc: "Demander la suspension du traitement.",
            },
          ].map((right) => (
            <div key={right.title} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <p className="font-semibold text-white mb-1 text-xs">{right.title}</p>
              <p className="text-zinc-400 text-xs leading-relaxed">{right.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm">
          <p className="text-zinc-300 font-semibold mb-2">Comment exercer vos droits</p>
          <p className="text-zinc-400 leading-relaxed">
            Envoyez votre demande à{" "}
            <a href="mailto:privacy@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              privacy@aevia.io
            </a>{" "}
            en précisant votre nom et adresse email. Nous répondrons dans un délai d'un mois.
          </p>
        </div>
      </section>

      {/* ── 8. Sécurité ─────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          8. Sécurité des données
        </h2>
        <p className="text-sm leading-relaxed text-zinc-400 mb-3">
          AeviaLaunch met en œuvre des mesures techniques et organisationnelles appropriées
          pour protéger vos données :
        </p>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1 ml-2">
          <li>Chiffrement des communications par TLS 1.2+ (HTTPS)</li>
          <li>Hachage des mots de passe (bcrypt)</li>
          <li>Authentification par JWT avec expiration de session</li>
          <li>Isolation des données par compte (multi-tenant strict)</li>
          <li>Sauvegardes chiffrées de la base de données</li>
          <li>Accès aux données restreint aux administrateurs</li>
          <li>Journalisation des accès aux données sensibles</li>
        </ul>
      </section>

      {/* ── 9. Contact ──────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">
          9. Contact
        </h2>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-sm space-y-2">
          <p className="text-zinc-300 font-semibold mb-2">Pour toute question relative à cette politique :</p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Email :</span>{" "}
            <a href="mailto:privacy@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              privacy@aevia.io
            </a>
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-300">Email général :</span>{" "}
            <a href="mailto:hello@aevia.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              hello@aevia.io
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
          Ce document constitue la politique de confidentialité effective d'AeviaLaunch.
          Pour tout conseil juridique spécifique, consultez un expert en droit des données.
        </p>
      </div>
    </main>
  )
}
