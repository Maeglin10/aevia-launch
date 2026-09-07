/*
  Pose à la main l'association domaine → session (cas des domaines rattachés
  avant l'automatisation, ou corrections).
  Usage : BLOB_READ_WRITE_TOKEN=... node scripts/mapper-domaine.mjs monatelier.fr <sessionId>
*/
import { put } from "@vercel/blob";
const [domaine, sessionId] = process.argv.slice(2);
if (!domaine || !sessionId) { console.error("usage: mapper-domaine.mjs <domaine> <sessionId>"); process.exit(1); }
await put(`domains/${domaine.toLowerCase()}.json`, JSON.stringify({ sessionId }), {
  access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json",
});
console.log(`✅ ${domaine} → ${sessionId}`);
