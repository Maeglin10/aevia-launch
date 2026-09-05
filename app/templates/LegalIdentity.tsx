"use client";

/**
 * The publisher's legal identifier, shown in footers and mentions légales.
 *
 * Every template hardcoded Aevia's own SIREN (852 546 225) with no client
 * substitution, so a delivered site would legally name Aevia as its publisher
 * instead of the client who bought it. That is wrong on a mentions légales
 * page, which must identify the actual editor of the site.
 *
 * The demo keeps showing Aevia's number on purpose — it is what protects the
 * catalogue from being lifted wholesale. As soon as a session carries the
 * client's own identifier, that one is used instead.
 *
 * A SIRET is a SIREN followed by a 5-digit establishment code, so when the
 * client supplies a SIRET we show its first nine digits under a "SIREN" label
 * rather than printing a SIRET where the page says SIREN.
 */

import { useEffect, useState } from "react";

function sirenFrom(siret?: string): string | null {
  if (!siret) return null;
  const digits = siret.replace(/\D/g, "");
  if (digits.length < 9) return null;
  const s = digits.slice(0, 9);
  return `${s.slice(0, 3)} ${s.slice(3, 6)} ${s.slice(6, 9)}`;
}

export function LegalIdentity({
  fallback = "852 546 225",
  kind = "siren",
}: {
  fallback?: string;
  /** "siren" prints the 9-digit identifier; "siret" prints it in full. */
  kind?: "siren" | "siret";
}) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then((s) => {
        const siret: string | undefined = s?.businessProfile?.legal?.siret;
        if (siret) {
          setValue(kind === "siret" ? siret.trim() : sirenFrom(siret));
          return;
        }
        /*
          Session client sans identifiant : afficher le SIREN d'Aevia sous le
          nom du client serait une mention légale fausse. Un libellé honnête
          vaut mieux qu'un numéro qui n'est pas le sien.
        */
        if (s?.formData?.businessName) setValue("communiqué sur demande");
      })
      .catch(() => {});
  }, [kind]);

  return <>{value ?? fallback}</>;
}

export default LegalIdentity;
