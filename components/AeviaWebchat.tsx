"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export function AeviaWebchat() {
  const pathname = usePathname();

  /*
    Pas de bulle de discussion là où elle gêne. Sur les aperçus de thème elle
    s'invitait dans le site du client ; dans le tunnel de création, sa pastille
    flottante recouvrait le bouton « Continuer » sur téléphone — le client ne
    pouvait plus valider son étape. Elle reste sur les pages d'avant-vente, où
    elle répond aux questions.
  */
  if (
    pathname?.startsWith("/templates/") ||
    pathname?.startsWith("/preview/") ||
    pathname?.startsWith("/configure") ||
    pathname?.startsWith("/maison-maria/")
  ) {
    return null;
  }

  return (
    <Script
      async
      src="https://inbox.aevia.services/webchat/widget.js"
      data-widget-id="wid_2a6ea934ea6a6404d285e9fc93cb0707"
      data-api-url="https://skybot-inbox-production.up.railway.app/api/v1"
      strategy="afterInteractive"
    />
  );
}
