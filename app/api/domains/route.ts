import { NextResponse } from "next/server";
import { alternatives, decouper, prixDe, EXTENSIONS } from "@/lib/domains/pricing";

/*
  Le nom de domaine que le client veut : est-il libre, à quel prix, et sinon
  que lui proposer ?

  GET /api/domains?q=ateliers-vidal.fr

  La disponibilité vient de Netim, via le backend Aevia (lecture seule, aucun
  achat). Le prix vient de notre table : Netim ne renvoie un montant que pour
  les domaines premium, et de toute façon ce que le client paie inclut la
  configuration, pas seulement le nom.

  Sans clé backend, on répond quand même — prix et alternatives — en disant
  franchement que la disponibilité n'a pas pu être vérifiée. Un formulaire qui
  se bloque parce qu'un service tiers ne répond pas est pire qu'un formulaire
  qui avance en le disant.
*/

const BACKEND = process.env.AEVIA_BACKEND_URL || "https://skybot-inbox-production.up.railway.app";

type Verdict = { domaine: string; libre: boolean | null; prix: number | null; note?: string; premium?: boolean };

async function disponibilite(domaines: string[]): Promise<Map<string, boolean | null>> {
  const out = new Map<string, boolean | null>(domaines.map((d) => [d, null]));
  const cle = process.env.AEVIA_BACKEND_API_KEY;
  if (!cle) return out;
  await Promise.all(domaines.map(async (d) => {
    try {
      const r = await fetch(`${BACKEND}/api/v1/domains/netim/check?q=${encodeURIComponent(d)}`, {
        headers: { "x-api-key": cle },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) return;
      const j = (await r.json()) as { results?: Array<{ domain: string; available?: boolean }> };
      const res = j.results?.[0];
      if (res && typeof res.available === "boolean") out.set(d, res.available);
    } catch {
      /* le service ne répond pas : on laisse « inconnu », on ne bloque pas */
    }
  }));
  return out;
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ extensions: EXTENSIONS }, { status: 200 });
  }

  const decoupe = decouper(q);
  if (!decoupe) {
    return NextResponse.json(
      { erreur: "Écrivez le nom complet, extension comprise — par exemple ateliers-vidal.fr" },
      { status: 400 },
    );
  }

  const { racine, extension } = decoupe;
  const demande = `${racine}${extension}`;
  const propositions = alternatives(racine, extension);
  const tous = [demande, ...propositions];
  const libres = await disponibilite(tous);

  const verdict = (d: string): Verdict => {
    const dec = decouper(d)!;
    const tarif = prixDe(dec.extension);
    return {
      domaine: d,
      libre: libres.get(d) ?? null,
      prix: tarif?.prix ?? null,
      note: tarif?.note,
    };
  };

  return NextResponse.json({
    demande: verdict(demande),
    /* Seulement ce qu'on sait enregistrer ET rattacher automatiquement. */
    alternatives: propositions.map(verdict).filter((v) => v.prix !== null),
    /*
      Le client peut toujours refuser : son site vit alors sur une adresse en
      .vercel.app, offerte, et il pourra brancher un domaine plus tard.
    */
    sansDomaine: { prix: 0, note: "Votre site reste en ligne sur une adresse en .vercel.app, sans frais." },
    disponibiliteVerifiee: libres.get(demande) !== null,
  });
}
