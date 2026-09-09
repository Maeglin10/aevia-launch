import { NextRequest, NextResponse } from "next/server";
/* Source unique, partagée avec robots.txt et sitemap.xml. */
import { HOTES_PLATEFORME } from "@/lib/hotePlateforme";

/*
  Les domaines des clients arrivent sur CE déploiement (rattachés au projet
  Vercel à l'achat). Sans cette réécriture, monatelier.fr servait la page
  d'accueil d'Aevia Launch — le nom acheté ne menait pas au site payé.

  L'association domaine → session vit dans un JSON public par domaine
  (domains/<hôte>.json) : une requête CDN, mise en cache, par navigation.
*/


function hoteBlob(): string | null {
  const jeton = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  const depot = jeton.split("_")[3] ?? null;
  return depot ? `https://${depot}.public.blob.vercel-storage.com` : null;
}

export async function middleware(req: NextRequest) {
  /* Le port fait partie de l'en-tête Host (localhost:3100, previews) mais
     jamais du nom de domaine acheté : on le retire avant toute comparaison. */
  const hote = (req.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  if (!hote || HOTES_PLATEFORME.has(hote) || hote.endsWith(".vercel.app")) {
    return NextResponse.next();
  }
  // Seule la racine du domaine client est réécrite : les chemins internes
  // (/templates/…, /api/…) existent déjà dans l'application.
  if (req.nextUrl.pathname !== "/") return NextResponse.next();

  const base = hoteBlob();
  if (!base) return NextResponse.next();

  /* Les robots des réseaux sociaux (WhatsApp, Facebook, LinkedIn, X…)
     n'exécutent pas le JavaScript : ils liraient les métadonnées d'Aevia
     laissées dans le HTML du thème. On leur sert une page minimale portant
     l'identité du client — c'est l'aperçu qui s'affiche quand il partage son
     site. */
  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();
  const robotSocial = /facebookexternalhit|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|pinterest|embedly/.test(ua);
  try {
    const r = await fetch(`${base}/domains/${hote.replace(/^www\./, "")}.json`, {
      // le CDN Blob cache ; en cas de domaine inconnu, 404 rapide.
      next: { revalidate: 300 },
    });
    if (!r.ok) return NextResponse.next();
    const { sessionId, template } = (await r.json()) as { sessionId?: string; template?: string };
    if (!sessionId) return NextResponse.next();
    if (robotSocial) {
      const session = await fetch(`${base}/sessions/${sessionId}.json`, { next: { revalidate: 300 } })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      const fd = session?.formData ?? {};
      const gc = session?.generatedContent ?? {};
      const nom = (fd.businessName ?? "").toString().trim();
      if (nom) {
        const ville = (fd.city ?? "").toString().trim();
        const titre = (gc.metaTitle ?? (ville ? `${nom} — ${ville}` : nom)).toString();
        const description = (gc.metaDescription ?? fd.tagline ?? nom).toString();
        const image = (fd.photoUrls ?? [])[0] ?? fd.logoUrl ?? "";
        const url = `https://${hote}${req.nextUrl.pathname}`;
        const esc = (v: string) =>
          v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        return new NextResponse(
          `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"/>` +
            `<title>${esc(titre)}</title>` +
            `<link rel="canonical" href="${esc(url)}"/>` +
            `<meta name="description" content="${esc(description)}"/>` +
            `<meta property="og:type" content="website"/>` +
            `<meta property="og:site_name" content="${esc(nom)}"/>` +
            `<meta property="og:title" content="${esc(titre)}"/>` +
            `<meta property="og:description" content="${esc(description)}"/>` +
            `<meta property="og:url" content="${esc(url)}"/>` +
            (image ? `<meta property="og:image" content="${esc(String(image))}"/>` : "") +
            `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}"/>` +
            `</head><body><h1>${esc(titre)}</h1><p>${esc(description)}</p></body></html>`,
          { headers: { "Content-Type": "text/html; charset=utf-8" } },
        );
      }
    }

    const url = req.nextUrl.clone();
    /* Rewrite, pas redirect : la barre d'adresse du client reste son domaine
       nu. La session voyage par cookie — le layout du catalogue l'amorce dans
       sessionStorage avant l'hydratation, là où chaque thème sait déjà lire. */
    url.pathname = template ? `/templates/${template}` : `/site/${sessionId}`;
    if (template) url.searchParams.delete("session");
    const reponse = NextResponse.rewrite(url);
    reponse.cookies.set("aevia-session", sessionId, { path: "/", sameSite: "lax" });
    if (template) reponse.cookies.set("aevia-template", template, { path: "/", sameSite: "lax" });
    return reponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon|thumbnails/|images/).*)"],
};
