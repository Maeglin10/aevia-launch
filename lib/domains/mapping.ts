/*
  Le lien domaine → site : la pièce qui manquait au fulfilment.

  Le webhook achetait le domaine et le rattachait au projet Vercel, mais rien
  ne disait à l'application QUEL site servir quand ce domaine arrive : le
  client aurait vu la page d'accueil d'Aevia Launch sur son propre nom.

  Un JSON par domaine, chemin fixe : le middleware Edge le lit par une simple
  requête (l'association domaine → identifiant de session n'est pas un
  secret — l'identifiant figure déjà dans le lien d'aperçu du client).
*/
import { put } from "@vercel/blob";

export async function enregistrerDomaine(domaine: string, sessionId: string): Promise<void> {
  await put(`domains/${domaine.toLowerCase()}.json`, JSON.stringify({ sessionId }), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** L'hôte du dépôt Blob, déduit du jeton (même règle que lib/sessions). */
export function hoteBlob(): string | null {
  const jeton = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  const depot = jeton.split("_")[3] ?? null;
  return depot ? `https://${depot}.public.blob.vercel-storage.com` : null;
}
