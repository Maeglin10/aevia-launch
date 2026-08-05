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

/*
  Les banques d'images indexent en anglais. « plombier » y ramenait un cimetière
  militaire, « avocat » des fruits, « traiteur » n'importe quoi : le premier
  élément visuel du site du client tenait à un hasard de traduction. On envoie
  donc le terme anglais du métier, et l'on ajoute le mot qui cadre la scène —
  « at work », « shop », « interior » — pour écarter les portraits d'illustration.
*/
const METIER_EN: Record<string, string> = {
  plombier: "plumber at work", electricien: "electrician at work",
  coiffeur: "hair salon interior", barbier: "barber shop",
  avocat: "law office lawyer", notaire: "notary office",
  comptable: "accountant office desk", restaurateur: "restaurant interior",
  restaurant: "restaurant interior", boulangerie: "bakery bread shop",
  brasserie: "brasserie interior", caviste: "wine shop",
  photographe: "photographer camera studio", architecte: "architecture studio model",
  "kinésithérapeute": "physiotherapy treatment", kine: "physiotherapy treatment",
  "ostéopathe": "osteopathy treatment", osteo: "osteopathy treatment",
  fleuriste: "flower shop florist", medecin: "doctor consultation",
  "médecin": "doctor consultation", dentiste: "dental practice",
  veterinaire: "veterinary clinic", "vétérinaire": "veterinary clinic",
  pharmacie: "pharmacy interior", opticien: "optician eyewear store",
  infirmier: "nurse care", laboratoire: "medical laboratory",
  podologue: "podiatry care", paysagiste: "landscape gardener garden",
  menuisier: "carpenter workshop wood", couvreur: "roofer roof work",
  peintre: "house painter wall", serrurier: "locksmith door",
  macon: "mason bricklayer construction", "maçon": "mason bricklayer construction",
  carreleur: "tiler tiles floor", jardinier: "gardener garden",
  toiletteur: "dog grooming salon", tatoueur: "tattoo studio",
  couture: "sewing atelier fabric", bijouterie: "jewellery shop",
  mariage: "wedding celebration", coach: "personal trainer gym",
  menage: "house cleaning service", demenageur: "moving company boxes",
  pressing: "dry cleaning shop", securite: "security guard",
  formation: "training classroom", creche: "nursery children",
  vtc: "private driver car", vitrier: "glazier window",
  pisciniste: "swimming pool construction", cuisiniste: "kitchen showroom",
  hotel: "hotel room interior", producteur: "local farm produce",
  esthetique: "beauty salon treatment", naturopathe: "naturopathy herbs",
};

/** Le terme envoyé aux banques : l'anglais du métier, à défaut ce qu'on a reçu. */
function requeteUtile(q: string): string {
  const clef = q.toLowerCase().trim();
  return METIER_EN[clef] ?? q;
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const n = Math.min(Number(req.nextUrl.searchParams.get("n") ?? 12), 30);
  if (!q) return NextResponse.json({ images: [] });

  const terme = requeteUtile(q);
  const [pexels, pixabay] = await Promise.allSettled([
    searchPexelsImages(terme, { perPage: n }),
    searchPixabayImages(terme, { perPage: n }),
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
// La grande version d'une vignette Pixabay : « …_150.jpg » devient « …_1280.jpg ».
function grandeTaille(apercu: string | undefined): string | undefined {
  if (!apercu?.includes("cdn.pixabay.com")) return undefined;
  const grand = apercu.replace(/_\d+\.(jpe?g|png)$/i, "_1280.$1");
  return grand === apercu ? undefined : grand;
}

  const dePixabay =
    pixabay.status === "fulfilled"
      ? pixabay.value.map((r: any) => ({
          /*
            `largeImageURL` et `webformatURL` pointent sur `pixabay.com/get/…`,
            une adresse signée qui **expire en vingt-quatre heures** : le site
            livré aujourd'hui perdait ses photos demain, et le navigateur les
            recevait déjà cassées à la mesure. `previewURL` vit sur le CDN, à
            demeure ; sa grande version se déduit du suffixe de taille.
          */
          url: grandeTaille(r.previewURL) ?? r.largeImageURL ?? r.webformatURL,
          apercu: r.previewURL ?? r.webformatURL,
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
