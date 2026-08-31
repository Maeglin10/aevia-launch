import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MODELES_INDEXABLES,
  modeleParId,
  ficheModele,
  titreModele,
  descriptionModele,
  descriptifDetaille,
  type FicheModele,
} from "@/lib/templates/modeleSeo";

/**
 * Une page par modèle du catalogue.
 *
 * Mesuré le 30/08/2026 : la suite Aevia n'expose que 73 pages uniques, dont 25
 * pour Launch — alors que le catalogue décrit 373 modèles, chacun avec son nom,
 * son métier, son nombre de sections et son prix. La galerie `/themes` affiche
 * tout dans une grille rendue côté client : un moteur n'y voit qu'une seule
 * page, et la requête qui compte — « modèle de site pour dentiste » — n'a rien
 * à se mettre sous la dent.
 *
 * Ces pages sont rendues côté serveur et générées à la compilation, donc le
 * texte est dans le HTML, pas dans un paquet JavaScript. Seuls les modèles
 * au-dessus de la barrière de vente (score ≥ 40/100) en reçoivent une : ce
 * qu'on refuse de vendre, on refuse aussi de le faire remonter.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELES_INDEXABLES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const modele = modeleParId(id);
  if (!modele) return {};
  const f = ficheModele(modele);
  const titre = titreModele(f);
  const description = descriptionModele(f);

  return {
    title: titre,
    description,
    alternates: { canonical: f.url },
    openGraph: {
      title: titre,
      description,
      url: f.url,
      images: [{ url: f.vignette, width: 1280, height: 720, alt: `Aperçu du modèle ${f.nom}` }],
      type: "website",
    },
  };
}

/** Fil d'Ariane + fiche produit. Aucun fil d'Ariane n'existait dans la suite. */
function schema(f: FicheModele) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://launch.aevia.services" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://launch.aevia.services/themes/modeles" },
          { "@type": "ListItem", position: 3, name: f.nom, item: f.url },
        ],
      },
      {
        "@type": "Product",
        name: `${f.nom} — modèle de site web`,
        description: descriptionModele(f),
        image: `https://launch.aevia.services${f.vignette}`,
        url: f.url,
        category: f.categorieFr,
        brand: { "@type": "Brand", name: "Aevia Launch" },
        offers: {
          "@type": "Offer",
          price: f.prix,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: "https://launch.aevia.services/configure",
        },
      },
    ],
  };
}

export default async function PageModele({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const modele = modeleParId(id);
  if (!modele) notFound();
  const f = ficheModele(modele);
  const detaille = descriptifDetaille(f.id);

  // Modèles voisins : même métier d'abord, sinon même catégorie. Le maillage
  // interne était inexistant — chaque page ne menait qu'à elle-même.
  const voisins = MODELES_INDEXABLES.filter((t) => t.id !== f.id)
    .map((t) => ficheModele(t))
    .filter((v) =>
      f.metiers.length
        ? v.metiers.some((m) => f.metiers.some((x) => x.id === m.id))
        : v.categorie === f.categorie,
    )
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema(f)) }}
      />

      <div className="max-w-5xl mx-auto px-6 py-14">
        <nav aria-label="Fil d'Ariane" className="text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white/70">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/themes/modeles" className="hover:text-white/70">Modèles</Link>
          <span className="mx-2">/</span>
          <span className="text-white/70">{f.nom}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{titreModele(f)}</h1>

        <p className="text-white/60 leading-relaxed mb-8 max-w-3xl">{descriptionModele(f)}</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={f.vignette}
          alt={`Aperçu du modèle de site ${f.nom}${f.metiers[0] ? ` pour ${f.metiers[0].labelCourt.toLowerCase()}` : ""}`}
          width={1280}
          height={720}
          className="w-full rounded-xl border border-white/10 mb-8"
        />

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href={f.urlApercu}
            className="px-5 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Voir la démonstration
          </Link>
          <Link
            href="/configure"
            className="px-5 py-3 rounded-lg border border-white/20 font-semibold hover:bg-white/5 transition"
          >
            Créer mon site avec ce modèle — {f.prix} €
          </Link>
        </div>

        {detaille && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Ce que fait ce modèle</h2>
            <p className="text-white/70 leading-relaxed max-w-3xl">{detaille}</p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Ce que contient ce modèle</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-white/50">Format</dt>
              <dd>{f.multiPages ? "Site multi-pages" : "Page unique"}</dd>
            </div>
            {f.sections ? (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-white/50">Sections</dt>
                <dd>{f.sections}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-white/50">Gamme</dt>
              <dd>{f.palierLabel} — {f.prix} €</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-white/50">Ambiance</dt>
              <dd className="capitalize">{f.styleFr}</dd>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <dt className="text-white/50">Catégorie</dt>
              <dd className="capitalize">{f.categorieFr}</dd>
            </div>
            {f.villeDemo ? (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <dt className="text-white/50">Démonstration</dt>
                <dd>{f.villeDemo}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        {f.metiers.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Métiers pour lesquels ce modèle est câblé</h2>
            <p className="text-white/50 text-sm mb-4 max-w-2xl">
              Le contenu, les rubriques et les appels à l&apos;action sont adaptés à ces
              activités. Votre nom, vos prestations et vos tarifs remplacent ceux de la
              démonstration au moment de la génération.
            </p>
            <ul className="flex flex-wrap gap-2">
              {f.metiers.map((m) => (
                <li
                  key={m.id}
                  className="px-3 py-1.5 rounded-full border border-white/15 text-sm text-white/80"
                >
                  <span aria-hidden className="mr-1.5">{m.emoji}</span>
                  {m.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        {f.tags.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Caractéristiques</h2>
            <ul className="flex flex-wrap gap-2">
              {f.tags.map((tag) => (
                <li key={tag} className="px-3 py-1.5 rounded-full bg-white/5 text-sm text-white/70">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Ce qui est inclus, quel que soit le modèle</h2>
          <ul className="text-white/60 text-sm space-y-2 max-w-2xl list-disc pl-5">
            <li>Votre contenu rédigé à partir de votre activité, pas un texte de démonstration.</li>
            <li>Votre nom de domaine, l&apos;hébergement et le certificat.</li>
            <li>Search Console et Analytics branchés, données structurées posées.</li>
            <li>Affichage téléphone vérifié, appel à l&apos;action visible sans défiler.</li>
            <li>Mentions légales et politique de confidentialité générées.</li>
            <li>Un paiement unique de {f.prix} €, sans abonnement.</li>
          </ul>
        </section>

        {voisins.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">
              {f.metiers[0]
                ? `Autres modèles pour ${f.metiers[0].labelCourt.toLowerCase()}`
                : `Autres modèles ${f.categorieFr}`}
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {voisins.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/themes/modele/${v.id}`}
                    className="block rounded-lg border border-white/10 overflow-hidden hover:border-white/30 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.vignette}
                      alt={`Aperçu du modèle ${v.nom}`}
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-video object-cover"
                    />
                    <span className="block px-3 py-2 text-sm">{v.nom}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-12 text-sm text-white/40">
          <Link href="/themes" className="underline hover:text-white/70">
            Voir tout le catalogue
          </Link>
          {" · "}
          <Link href="/pricing" className="underline hover:text-white/70">
            Tarifs
          </Link>
        </p>
      </div>
    </main>
  );
}
