// Rattacher le domaine du client au projet, sans intervention humaine.
//
// C'était la dernière étape manuelle du parcours : le webhook savait
// enregistrer un domaine chez Netim, puis écrivait « Reste : ajouter le
// domaine au projet Vercel ». Tant que personne ne le faisait, le client avait
// payé un nom qui ne menait nulle part.
//
// Deux appels suffisent : déclarer le domaine sur le projet, puis lire les
// enregistrements DNS que Vercel attend. Ces valeurs partent ensuite au client
// et à nous — c'est chez le registraire qu'elles doivent être posées, et Netim
// n'expose pas toujours cette écriture.

const API = "https://api.vercel.com";

export type RattachementDomaine = {
  ok: boolean;
  /** Ce qu'on peut lire au client, en français, sans jargon d'API. */
  message: string;
  /** Les enregistrements à poser chez le registraire, quand Vercel en demande. */
  dns?: Array<{ type: string; nom: string; valeur: string }>;
};

/*
  Le projet et l'équipe viennent de l'environnement : ce fichier ne doit rien
  savoir d'un identifiant en particulier, sinon un déploiement sur un autre
  projet rattacherait les domaines des clients au mauvais endroit.
*/
function reglages() {
  const jeton = process.env.VERCEL_API_TOKEN;
  const projet = process.env.VERCEL_PROJECT_ID;
  const equipe = process.env.VERCEL_TEAM_ID;
  return { jeton, projet, equipe };
}

export async function rattacherAuProjet(domaine: string): Promise<RattachementDomaine> {
  const { jeton, projet, equipe } = reglages();
  if (!jeton || !projet) {
    return { ok: false, message: `Domaine ${domaine} à rattacher à la main : VERCEL_API_TOKEN ou VERCEL_PROJECT_ID manquant.` };
  }
  const suffixe = equipe ? `?teamId=${encodeURIComponent(equipe)}` : "";

  try {
    const r = await fetch(`${API}/v10/projects/${encodeURIComponent(projet)}/domains${suffixe}`, {
      method: "POST",
      headers: { authorization: `Bearer ${jeton}`, "content-type": "application/json" },
      body: JSON.stringify({ name: domaine }),
      signal: AbortSignal.timeout(15000),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };

    /*
      Un domaine déjà rattaché n'est pas un échec : le webhook peut être rejoué
      (Stripe réessaie jusqu'à trois jours), et refuser le doublon ferait
      croire à une panne.
    */
    const dejaLa = j?.error?.code === "domain_already_in_use" || j?.error?.code === "domain_taken";
    if (!r.ok && !dejaLa) {
      return { ok: false, message: `Rattachement de ${domaine} refusé par Vercel (${j?.error?.message ?? r.status}) — à traiter à la main.` };
    }

    const dns = await enregistrementsAttendus(domaine);
    return {
      ok: true,
      message: dejaLa
        ? `Domaine ${domaine} déjà rattaché au projet.`
        : `Domaine ${domaine} rattaché au projet.`,
      dns,
    };
  } catch (e) {
    return { ok: false, message: `Rattachement de ${domaine} impossible : ${e instanceof Error ? e.message : String(e)} — à traiter à la main.` };
  }
}

/*
  Ce que le registraire doit pointer. Vercel répond différemment selon qu'il
  s'agit du domaine nu ou d'un sous-domaine ; on renvoie ce qu'il dit, sans
  l'interpréter, pour ne pas inventer une valeur qui ferait tomber le site.
*/
async function enregistrementsAttendus(domaine: string): Promise<RattachementDomaine["dns"]> {
  const { jeton, projet, equipe } = reglages();
  const suffixe = equipe ? `?teamId=${encodeURIComponent(equipe)}` : "";
  try {
    const r = await fetch(
      `${API}/v9/projects/${encodeURIComponent(projet!)}/domains/${encodeURIComponent(domaine)}/config${suffixe}`,
      { headers: { authorization: `Bearer ${jeton!}` }, signal: AbortSignal.timeout(10000) },
    );
    if (!r.ok) return undefined;
    const j = (await r.json()) as {
      misconfigured?: boolean;
      aValues?: string[];
      cnames?: string[];
      recommendedCNAME?: Array<{ value?: string }>;
    };
    const dns: NonNullable<RattachementDomaine["dns"]> = [];
    for (const a of j.aValues ?? []) dns.push({ type: "A", nom: "@", valeur: a });
    for (const c of j.cnames ?? []) dns.push({ type: "CNAME", nom: "www", valeur: c });
    for (const c of j.recommendedCNAME ?? []) if (c.value) dns.push({ type: "CNAME", nom: "www", valeur: c.value });
    return dns.length ? dns : undefined;
  } catch {
    return undefined;
  }
}
