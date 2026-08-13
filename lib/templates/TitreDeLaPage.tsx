"use client";

import { clientCity, clientName, clientTagline, clientTrade } from "./clientContent";

/**
 * Le titre de niveau 1 de la page, pour les moteurs et les lecteurs d'écran.
 *
 * Treize thèmes n'avaient aucun `<h1>` : leur titre de héros est peint par le
 * geste signature — LineScroll, GhostSolid, un mot qui grandit — dans un `div`
 * stylé à la main. À l'œil, c'est bien un titre ; pour un moteur de recherche
 * et pour un lecteur d'écran, la page n'en a pas.
 *
 * On n'y touche pas au dessin : on ajoute un `h1` que l'œil ne voit pas et que
 * la machine lit. Il porte ce qu'un titre doit porter — le nom de l'entreprise,
 * son métier, sa ville — et retombe sur le titre du thème quand le client n'a
 * rien rempli.
 *
 * `clip-path` plutôt que `display: none` ou `visibility: hidden` : ces deux-là
 * retirent l'élément de l'arbre d'accessibilité, ce qui reviendrait à ne rien
 * faire.
 */
export function TitreDeLaPage({
  session,
  repli,
}: {
  session: unknown;
  /** Ce que le thème affiche en grand, quand le client n'a rien saisi. */
  repli?: string;
}) {
  const s = session as Parameters<typeof clientName>[0];
  const nom = clientName(s);
  const metier = clientTrade(s);
  const ville = clientCity(s);

  const morceaux = [nom, [metier, ville].filter(Boolean).join(" à ")].filter(Boolean);
  const texte = morceaux.length ? morceaux.join(" — ") : (repli ?? clientTagline(s) ?? "");
  if (!texte) return null;

  return (
    <h1
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {texte}
    </h1>
  );
}
