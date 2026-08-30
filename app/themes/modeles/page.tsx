import type { Metadata } from "next";
import Link from "next/link";
import { MODELES_INDEXABLES, ficheModele, metiersDuModele } from "@/lib/templates/modeleSeo";
import { SECTORS } from "@/lib/templates/sectors";

/**
 * L'index des modèles — le moyeu qui rend les pages de modèles atteignables.
 *
 * Un plan de site fait découvrir des URL ; il ne dit pas comment elles se
 * rangent les unes par rapport aux autres. Ce regroupement par métier le dit,
 * et il donne à chaque page de modèle des liens entrants depuis une page qui a
 * du sens — ce que la galerie `/themes`, rendue côté client, ne peut pas faire.
 */

const TOTAL = MODELES_INDEXABLES.length;

export const metadata: Metadata = {
  title: `Tous les modèles de sites web — ${TOTAL} designs par métier`,
  description: `Les ${TOTAL} modèles de sites Aevia Launch, classés par métier : santé, artisanat, restauration, conseil, commerce. Démonstration en ligne pour chacun, site livré en 2 h à partir de 399 €.`,
  alternates: { canonical: "https://launch.aevia.services/themes/modeles" },
  openGraph: {
    title: `Tous les modèles de sites web — ${TOTAL} designs par métier`,
    description: `Les ${TOTAL} modèles Aevia Launch classés par métier, avec démonstration en ligne.`,
    url: "https://launch.aevia.services/themes/modeles",
    images: ["/api/og"],
  },
};

export default function IndexModeles() {
  const fiches = MODELES_INDEXABLES.map((t) => ficheModele(t));

  // Un modèle peut servir plusieurs métiers : il apparaît sous chacun. Les
  // modèles sans métier déclaré sont regroupés à part plutôt que perdus.
  const parMetier = SECTORS.map((s) => ({
    secteur: s,
    modeles: fiches.filter((f) => f.metiers.some((m) => m.id === s.id)),
  })).filter((g) => g.modeles.length > 0);

  const sansMetier = fiches.filter((f) => metiersDuModele(f.id).length === 0);

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://launch.aevia.services" },
              { "@type": "ListItem", position: 2, name: "Modèles", item: "https://launch.aevia.services/themes/modeles" },
            ],
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-14">
        <nav aria-label="Fil d'Ariane" className="text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white/70">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-white/70">Modèles</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Tous les modèles de sites, classés par métier
        </h1>
        <p className="text-white/60 leading-relaxed mb-4 max-w-3xl">
          {TOTAL} modèles prêts à recevoir votre contenu. Chaque fiche donne le format,
          le nombre de sections, la gamme et une démonstration en ligne. Le site est
          livré en deux heures avec votre domaine, à partir de 399 € en paiement unique.
        </p>
        <p className="text-white/40 text-sm mb-12 max-w-3xl">
          <Link href="/themes" className="underline hover:text-white/70">
            La galerie filtrable
          </Link>{" "}
          reste le moyen le plus rapide de trouver un design ; cette page-ci existe pour
          parcourir le catalogue métier par métier.
        </p>

        {parMetier.map(({ secteur, modeles }) => (
          <section key={secteur.id} className="mb-12">
            <h2 className="text-xl font-bold mb-4">
              <span aria-hidden className="mr-2">{secteur.emoji}</span>
              Modèles de site pour {secteur.label.toLowerCase()}
              <span className="ml-2 text-sm font-normal text-white/40">({modeles.length})</span>
            </h2>
            <ul className="flex flex-wrap gap-2">
              {modeles.map((f) => (
                <li key={`${secteur.id}-${f.id}`}>
                  <Link
                    href={`/themes/modele/${f.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/75 hover:border-white/30 hover:text-white transition"
                  >
                    {f.nom}
                    <span className="text-white/35 ml-2">{f.prix} €</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {sansMetier.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">
              Modèles polyvalents
              <span className="ml-2 text-sm font-normal text-white/40">({sansMetier.length})</span>
            </h2>
            <p className="text-white/50 text-sm mb-4 max-w-2xl">
              Ces designs ne visent pas un métier en particulier : ils conviennent à toute
              activité qui a besoin d&apos;une vitrine claire.
            </p>
            <ul className="flex flex-wrap gap-2">
              {sansMetier.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/themes/modele/${f.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/75 hover:border-white/30 hover:text-white transition"
                  >
                    {f.nom}
                    <span className="text-white/35 ml-2">{f.prix} €</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
