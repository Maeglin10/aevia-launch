import { NextRequest, NextResponse } from "next/server";
import { searchPexelsImages } from "@/lib/stock-media/pexels";
import { searchPixabayImages } from "@/lib/stock-media/pixabay";

/*
  Les banques d'images, réunies derrière une seule adresse.

  `lib/stock-media/pexels.ts` et `pixabay.ts` existaient depuis juillet, avec
  leurs clés dans l'environnement — et rien ne les appelait. Un client qui n'a
  pas de photo de son atelier n'avait donc que celles de la démonstration, les
  mêmes pour tous les thèmes de sa niche.

  On interroge les deux et on alterne les résultats, pour qu'un client tombe sur
  une image différente de celle de son voisin. Une banque qui échoue ou dont la
  clé manque est simplement ignorée : l'autre suffit.
*/

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const n = Math.min(Number(req.nextUrl.searchParams.get("n") ?? 12), 30);
  if (!q) return NextResponse.json({ images: [] });

  const [pexels, pixabay] = await Promise.allSettled([
    searchPexelsImages(q, { perPage: n }),
    searchPixabayImages(q, { perPage: n }),
  ]);

  const dePexels =
    pexels.status === "fulfilled"
      ? pexels.value.map((r) => ({
          url: r.src.large2x || r.src.large,
          apercu: r.src.medium,
          auteur: r.photographer,
          source: "Pexels" as const,
          lien: r.url,
        }))
      : [];
  const dePixabay =
    pixabay.status === "fulfilled"
      ? pixabay.value.map((r: any) => ({
          url: r.largeImageURL ?? r.webformatURL,
          apercu: r.webformatURL,
          auteur: r.user,
          source: "Pixabay" as const,
          lien: r.pageURL,
        }))
      : [];

  // Une banque puis l'autre, en alternance : deux clients de la même niche ne
  // reçoivent pas la même première image.
  const melange: unknown[] = [];
  for (let i = 0; i < Math.max(dePexels.length, dePixabay.length); i++) {
    if (dePexels[i]) melange.push(dePexels[i]);
    if (dePixabay[i]) melange.push(dePixabay[i]);
  }

  return NextResponse.json({ images: melange.slice(0, n) });
}
