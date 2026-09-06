"use client";

/*
  Le lien d'évitement, traduit. Il vit avant le LangProvider (racine serveur)
  et la langue choisie n'existe que dans le localStorage du navigateur : on la
  lit donc ici, après hydratation — le lecteur d'écran qui tabule arrive bien
  après ce premier rendu.
*/
import { useEffect, useState } from "react";

const LIBELLES: Record<string, string> = {
  fr: "Aller au contenu principal",
  en: "Skip to main content",
  es: "Saltar al contenido principal",
  de: "Zum Hauptinhalt springen",
  pt: "Saltar para o conteúdo principal",
};

export function LienEvitement() {
  const [texte, setTexte] = useState(LIBELLES.fr);
  useEffect(() => {
    try {
      const locale = window.localStorage.getItem("aevia-locale") ?? "fr";
      setTexte(LIBELLES[locale] ?? LIBELLES.fr);
    } catch {}
  }, []);
  return (
    <a
      href="#main-content"
      className="lien-evitement sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:font-semibold"
    >
      {texte}
    </a>
  );
}
