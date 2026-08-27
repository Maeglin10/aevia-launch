"use client";

/**
 * L'appel à l'action qui reste sous le pouce.
 *
 * Le problème mesuré sur les 56 thèmes de la série 328-383 : la barre de
 * navigation est en `position: fixed`, elle porte donc un bouton d'action
 * visible en permanence — mais SEULEMENT sur grand écran. Sous le point de
 * rupture, ce bouton part avec le menu déroulant, dans un bloc en
 * `display: none`. Relevé à l'écran en 390 × 844 : largeur 0, hauteur 0.
 *
 * Conséquence, sur téléphone :
 *   - 55 thèmes sur 56 n'avaient plus AUCUN appel à l'action une fois la page
 *     défilée — il fallait ouvrir le menu pour trouver le numéro ;
 *   - 6 thèmes n'en avaient aucun même sans défiler, le bouton du héros
 *     tombant sous la ligne de flottaison (mesuré à 858-917 px sur un écran
 *     de 844).
 *
 * Ce composant se pose à côté du bouton de menu et n'apparaît QUE là où le
 * menu déroulant prend la main. Il résout les deux cas d'un coup : la barre
 * étant fixe, un appel à l'action est visible dès le premier écran ET le
 * reste pendant tout le défilement.
 *
 * Le seuil d'apparition n'est pas écrit ici : chaque thème ajoute
 * `.aevia-action-mobile { display: inline-flex !important; }` dans la media
 * query qui fait déjà apparaître son propre bouton de menu. Les deux
 * paraissent donc toujours ensemble, quel que soit le point de rupture du
 * thème — ils vont de 900 à 1000 px selon les cas.
 *
 * Précédent : `impact-164` portait déjà ce correctif, seul sur 383 thèmes.
 */
export function ActionMobile({
  href,
  fond,
  encre,
  bordure,
  children,
}: {
  /** La cible : un `tel:` en général, un `mailto:` quand c'est l'usage du métier. */
  href: string;
  /** Aplat du bouton. Prendre l'accent du thème, jamais une couleur nouvelle. */
  fond: string;
  /** Encre du libellé, lisible sur `fond`. */
  encre: string;
  /** Filet optionnel, pour les thèmes dont l'accent est proche du fond de barre. */
  bordure?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="aevia-action-mobile"
      style={{
        background: fond,
        color: encre,
        border: bordure ? `1px solid ${bordure}` : "none",
        /*
          44 px de haut : la cible tactile minimale des recommandations
          d'accessibilité, et la mesure que le balayage du catalogue applique
          déjà aux liens de barre et de pied de page.
        */
        minHeight: 44,
        padding: "0 16px",
        borderRadius: 8,
        fontSize: 13.5,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: "0.01em",
        textDecoration: "none",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}
