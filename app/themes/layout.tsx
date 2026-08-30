import type { Metadata } from "next";
import Link from "next/link";
import { MODELES_INDEXABLES } from "@/lib/templates/modeleSeo";

/*
  Le titre annonçait « Browse 291 Website Themes » : en anglais sur un site
  destiné au marché français, et faux — le compte réel des modèles vendables
  vient de la barrière qualité du catalogue, pas d'un nombre recopié à la main.
  Il est donc calculé.

  La canonique reste déclarée ici pour la galerie ; les pages filles
  (/themes/modele/*, /themes/modeles) posent la leur, qui l'emporte.
*/
const TOTAL = MODELES_INDEXABLES.length;

export const metadata: Metadata = {
  title: `${TOTAL} modèles de sites web professionnels — galerie`,
  description: `Parcourez ${TOTAL} modèles de sites, filtrables par métier, secteur et gamme. Démonstration en ligne pour chacun ; votre site livré en 2 h avec votre contenu et votre domaine, à partir de 399 €.`,
  openGraph: {
    title: `${TOTAL} modèles de sites web professionnels`,
    description: `Filtrez par métier et par gamme, testez la démonstration, puis lancez la génération de votre site.`,
    url: "https://launch.aevia.services/themes",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  alternates: { canonical: "https://launch.aevia.services/themes" },
};

export default function ThemesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/*
        Le seul maillage interne rendu côté serveur de cette partie du site.

        La galerie est un composant client : son HTML initial fait 27 ko et ne
        contient aucun des liens de la grille — un robot n'y voit qu'une page
        vide. Ce pied de page, lui, est dans le HTML de la galerie comme des
        344 fiches, et c'est par là que l'index des modèles se fait découvrir
        autrement que par le plan de site.

        Posé dans ce layout et pas dans le layout racine : la racine enveloppe
        aussi `/templates/impact-*`, qui sont les sites livrés aux clients. Y
        injecter notre navigation reviendrait à poser Aevia dans le pied de page
        du site d'un client.
      */}
      <nav
        aria-label="Navigation du catalogue"
        className="border-t border-white/10 bg-[#050506] text-sm text-white/45"
      >
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/themes" className="hover:text-white/80 transition">
            Galerie des modèles
          </Link>
          <Link href="/themes/modeles" className="hover:text-white/80 transition">
            Modèles par métier
          </Link>
          <Link href="/showcase" className="hover:text-white/80 transition">
            Réalisations
          </Link>
          <Link href="/pricing" className="hover:text-white/80 transition">
            Tarifs
          </Link>
          <Link href="/configure" className="hover:text-white/80 transition">
            Créer mon site
          </Link>
          <Link href="/legal/mentions-legales" className="hover:text-white/80 transition">
            Mentions légales
          </Link>
        </div>
      </nav>
    </>
  );
}
