import { createHash } from "crypto";
import { list, put } from "@vercel/blob";

/*
  Qui a payé — par commande ET par client.

  2026-09-13. La relance à 48 h (`/api/cron/preview-reminder`) écarte une
  session si `paid/<sessionId>.json` existe. Ce marqueur est écrit par le
  webhook Stripe, avec l'identifiant de la session payée.

  Or `POST /api/sessions` tire un `crypto.randomUUID()` neuf à CHAQUE passage
  dans l'assistant. Le client qui recommence — nouvel onglet, lendemain, il
  hésite entre deux noms — laisse derrière lui plusieurs sessions complètes
  portant le même email. Il finit par payer sur l'une d'elles. Les autres
  restent « non payées », vieillissent de 48 h, et lui envoient :

      « Vous avez généré un aperçu personnalisé récemment, et il n'a pas
        encore été finalisé. »

  À un client qui vient de payer. C'est le genre de message qui fait douter
  d'avoir été débité, donc écrire au support, donc demander un remboursement.

  On marque donc aussi le CLIENT, pas seulement la commande. L'empreinte est
  un SHA-256 de l'email normalisé : le blob est public à chemin prévisible
  (voir l'incident du jeton d'édition), et une liste d'emails d'acheteurs en
  clair dans un bucket public serait une fuite en soi. Le contenu du marqueur
  ne porte aucune donnée personnelle non plus.
*/

const PREFIXE_COMMANDE = "paid/";
const PREFIXE_CLIENT = "paid-emails/";

export function empreinteEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

/** Liste tous les chemins d'un préfixe, curseurs compris. */
async function tousLesChemins(prefix: string): Promise<string[]> {
  const chemins: string[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix, cursor, limit: 1000 });
    chemins.push(...res.blobs.map((b) => b.pathname));
    cursor = res.cursor;
  } while (cursor);
  return chemins;
}

/**
 * Pose les deux marqueurs de paiement. Ne lève jamais : un échec de stockage
 * ne doit pas empêcher l'envoi des emails de commande — il fait seulement
 * courir le risque d'une relance à tort, que l'appelant journalise.
 */
export async function marquerPaye({
  sessionId,
  email,
}: {
  sessionId: string;
  email?: string | null;
}): Promise<{ commande: boolean; client: boolean }> {
  const corps = JSON.stringify({ paidAt: new Date().toISOString() });
  const options = {
    access: "public" as const,
    addRandomSuffix: false,
    contentType: "application/json",
  };

  const poser = async (chemin: string) => {
    try {
      await put(chemin, corps, options);
      return true;
    } catch (err) {
      console.error(`[paiement] marqueur non écrit : ${chemin}`, err);
      return false;
    }
  };

  const [commande, client] = await Promise.all([
    poser(`${PREFIXE_COMMANDE}${sessionId}.json`),
    email ? poser(`${PREFIXE_CLIENT}${empreinteEmail(email)}.json`) : Promise.resolve(false),
  ]);

  return { commande, client };
}

export async function commandesPayees(): Promise<Set<string>> {
  const chemins = await tousLesChemins(PREFIXE_COMMANDE);
  return new Set(chemins.map((p) => p.slice(PREFIXE_COMMANDE.length).replace(/\.json$/, "")));
}

/** Empreintes des clients ayant déjà payé au moins une commande. */
export async function clientsPayants(): Promise<Set<string>> {
  const chemins = await tousLesChemins(PREFIXE_CLIENT);
  return new Set(chemins.map((p) => p.slice(PREFIXE_CLIENT.length).replace(/\.json$/, "")));
}
