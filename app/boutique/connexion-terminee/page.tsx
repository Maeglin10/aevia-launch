"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/*
  Retour de l'onboarding Stripe du marchand. Sobre : un verdict, le lien de
  retour vers son site, et où suivre ses commandes.
*/
function Contenu() {
  const params = useSearchParams();
  const ok = params.get("etat") === "ok";
  const sessionId = params.get("session");

  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 460, textAlign: "center" }}>
        <div style={{ fontSize: 46, marginBottom: 12 }}>{ok ? "✅" : "⚠️"}</div>
        <h1 style={{ fontSize: 22, margin: "0 0 10px" }}>
          {ok ? "Paiement en ligne activé" : "La connexion n'a pas abouti"}
        </h1>
        <p style={{ color: "#52525b", fontSize: 14.5, lineHeight: 1.7 }}>
          {ok
            ? "Votre compte Stripe est relié : vos visiteurs peuvent maintenant acheter vos produits directement sur votre site, et chaque paiement arrive sur votre compte. Vous recevrez un email à chaque commande."
            : "Rien n'a été modifié. Reprenez l'activation depuis le panneau Boutique de votre site — si le problème persiste, écrivez-nous."}
        </p>
        {sessionId && (
          <p style={{ marginTop: 18 }}>
            <a href={`/preview/${sessionId}`} style={{ color: "#111", fontWeight: 600 }}>
              ← Retour à votre site
            </a>
            {ok && (
              <>
                {" · "}
                <a href={`/boutique/commandes?session=${sessionId}`} style={{ color: "#111", fontWeight: 600 }}>
                  Vos commandes
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Contenu />
    </Suspense>
  );
}
