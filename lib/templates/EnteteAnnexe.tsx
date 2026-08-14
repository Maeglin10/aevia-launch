"use client";

import { clientCity, clientName, clientTrade } from "./clientContent";

/**
 * L'identité du client en haut d'une page annexe.
 *
 * Douze thèmes ont des pages annexes sans en-tête ni pied de page : ni marque,
 * ni retour à l'accueil. Le visiteur qui y arrive ne sait plus chez qui il est,
 * et le client découvre des pages qui ne portent pas son nom — mesuré sur
 * trente-neuf pages.
 *
 * On pose donc une ligne discrète : le nom, le métier, la ville, et un chemin
 * de retour. Elle hérite des couleurs et de la fonte de la page ; sans session,
 * elle affiche le nom de la démonstration, comme le reste du thème.
 */
export function EnteteAnnexe({
  session,
  repli,
  accueil,
}: {
  session: unknown;
  /** Le nom que le thème affiche quand le client n'a rien rempli. */
  repli: string;
  /** Le chemin de l'accueil du thème, pour le lien de retour. */
  accueil?: string;
}) {
  const s = session as Parameters<typeof clientName>[0];
  const nom = clientName(s) ?? repli;
  const metier = clientTrade(s);
  const ville = clientCity(s);
  const sous = [metier, ville].filter(Boolean).join(" · ");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        flexWrap: "wrap",
        padding: "18px 6vw 0",
        fontSize: 13,
        letterSpacing: "0.04em",
        opacity: 0.75,
      }}
    >
      <a href={accueil ?? "."} style={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>
        {nom}
      </a>
      {sous && <span style={{ opacity: 0.7 }}>{sous}</span>}
    </div>
  );
}
