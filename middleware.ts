import { NextRequest, NextResponse } from "next/server";

/*
  Les domaines des clients arrivent sur CE déploiement (rattachés au projet
  Vercel à l'achat). Sans cette réécriture, monatelier.fr servait la page
  d'accueil d'Aevia Launch — le nom acheté ne menait pas au site payé.

  L'association domaine → session vit dans un JSON public par domaine
  (domains/<hôte>.json) : une requête CDN, mise en cache, par navigation.
*/

const HOTES_PLATEFORME = new Set([
  "aevia-launch.vercel.app",
  "launch.aevia.services",
  "localhost:3000",
  "localhost:3100",
]);

function hoteBlob(): string | null {
  const jeton = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  const depot = jeton.split("_")[3] ?? null;
  return depot ? `https://${depot}.public.blob.vercel-storage.com` : null;
}

export async function middleware(req: NextRequest) {
  const hote = (req.headers.get("host") ?? "").toLowerCase();
  if (!hote || HOTES_PLATEFORME.has(hote) || hote.endsWith(".vercel.app")) {
    return NextResponse.next();
  }
  // Seule la racine du domaine client est réécrite : les chemins internes
  // (/templates/…, /api/…) existent déjà dans l'application.
  if (req.nextUrl.pathname !== "/") return NextResponse.next();

  const base = hoteBlob();
  if (!base) return NextResponse.next();
  try {
    const r = await fetch(`${base}/domains/${hote.replace(/^www\./, "")}.json`, {
      // le CDN Blob cache ; en cas de domaine inconnu, 404 rapide.
      next: { revalidate: 300 },
    });
    if (!r.ok) return NextResponse.next();
    const { sessionId } = (await r.json()) as { sessionId?: string };
    if (!sessionId) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = `/site/${sessionId}`;
    return NextResponse.rewrite(url);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|thumbnails/|images/).*)"],
};
