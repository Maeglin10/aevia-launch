/*
  Migration one-shot : plus AUCUN jeton d'édition en clair au repos.

  Le blob des sessions est public à chemin prévisible ; l'editToken en clair y
  était lisible avec le seul lien d'aperçu. On réécrit chaque session avec le
  SHA-256 du jeton à la place du clair. Idempotent — les sessions déjà
  migrées sont ignorées.

  Usage : BLOB_READ_WRITE_TOKEN=... node scripts/migrer-jetons-sessions.mjs
*/
import { list, put } from "@vercel/blob";
import { createHash } from "node:crypto";

const sha256 = (t) => createHash("sha256").update(t).digest("hex");

let cursor;
let vus = 0, migres = 0, erreurs = 0;
do {
  const page = await list({ prefix: "sessions/", cursor, limit: 1000 });
  cursor = page.cursor;
  for (const b of page.blobs) {
    vus++;
    try {
      const r = await fetch(b.url, { cache: "no-store" });
      if (!r.ok) continue;
      const session = await r.json();
      if (!session?.editToken) continue; // déjà migrée ou sans jeton
      session.editTokenHash = session.editTokenHash ?? sha256(session.editToken);
      delete session.editToken;
      await put(b.pathname, JSON.stringify(session), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      migres++;
    } catch (e) {
      erreurs++;
      console.error("échec", b.pathname, String(e).slice(0, 80));
    }
  }
} while (cursor);
console.log(`${vus} sessions vues · ${migres} migrées · ${erreurs} erreurs`);
