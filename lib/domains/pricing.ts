// Le prix d'un nom de domaine, tel qu'on le vend au client.
//
// Netim nous facture le nom ; ce que le client paie inclut l'enregistrement,
// la configuration DNS, le rattachement au site et la première année. Les
// montants ci-dessous sont donc des prix de vente, pas des coûts d'achat.
//
// Un client qui refuse garde un `.vercel.app` : le domaine n'est jamais un
// péage à l'entrée, c'est une option.

export type PrixDomaine = {
  /** L'extension, point compris — « .fr ». */
  extension: string;
  /** Prix de vente en euros, première année comprise. */
  prix: number;
  /** Ce qui justifie ce choix pour le client, en une ligne. */
  note: string;
};

/*
  Les extensions qu'on sait enregistrer et rattacher sans intervention. Toute
  autre extension demandée par le client est traitée à la main : mieux vaut
  l'annoncer que promettre un automatisme qui n'existe pas.
*/
export const EXTENSIONS: PrixDomaine[] = [
  { extension: ".fr", prix: 29, note: "L'extension française, la plus rassurante pour une clientèle locale." },
  { extension: ".com", prix: 35, note: "La plus connue au monde, sans frontière." },
  { extension: ".be", prix: 35, note: "Pour une activité tournée vers la Belgique." },
  { extension: ".ch", prix: 49, note: "Pour une activité tournée vers la Suisse." },
  { extension: ".eu", prix: 29, note: "Européenne, utile quand plusieurs pays sont visés." },
  { extension: ".net", prix: 35, note: "Une solution de repli quand le .com est pris." },
  { extension: ".org", prix: 35, note: "Habituelle pour une association ou une fondation." },
  { extension: ".shop", prix: 39, note: "Dit tout de suite qu'on vend en ligne." },
  { extension: ".paris", prix: 45, note: "Ancre l'activité dans la ville." },
  { extension: ".bzh", prix: 45, note: "Ancre l'activité en Bretagne." },
];

/** Le prix d'une extension, ou rien si nous ne la traitons pas automatiquement. */
export function prixDe(extension: string): PrixDomaine | undefined {
  const e = extension.startsWith(".") ? extension.toLowerCase() : `.${extension.toLowerCase()}`;
  return EXTENSIONS.find((x) => x.extension === e);
}

/** Découpe « ateliers-vidal.fr » en « ateliers-vidal » et « .fr ». */
export function decouper(domaine: string): { racine: string; extension: string } | undefined {
  const propre = domaine.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const point = propre.indexOf(".");
  if (point <= 0 || point === propre.length - 1) return undefined;
  return { racine: propre.slice(0, point), extension: propre.slice(point) };
}

/*
  Deux ou trois autres pistes quand le nom demandé est pris ou trop cher.

  On ne propose que des extensions dont on connaît le prix et qu'on sait
  rattacher : suggérer un `.io` qu'il faudrait ensuite configurer à la main
  reviendrait à vendre une promesse qu'on ne tient pas.
*/
export function alternatives(racine: string, extensionDemandee: string, combien = 3): string[] {
  const demandee = extensionDemandee.toLowerCase();
  const ordre = [".fr", ".com", ".net", ".eu", ".shop", ".be", ".org"];
  const autres = ordre.filter((e) => e !== demandee);
  const variantes: string[] = autres.slice(0, combien).map((e) => `${racine}${e}`);
  /*
    Une variante du nom lui-même, pas seulement de l'extension : quand
    « vidal.fr » est pris, « vidal-plomberie.fr » a de bonnes chances de ne pas
    l'être, et reste lisible à l'oral.
  */
  if (variantes.length < combien + 1) variantes.push(`${racine}-officiel${demandee}`);
  return variantes.slice(0, combien + 1);
}
