import { describe, expect, it } from "vitest";
import { lireLesAvisColles } from "./avisColles";

/*
  Les blocs testés ici sont des collages réels dans leur forme : la sélection
  d'une page Google met l'auteur au-dessus, le statut « Local Guide », la note
  en étoiles, l'ancienneté, puis le texte ; un ancien site met souvent le nom
  en dessous ; Doctolib ne donne pas de note du tout.
*/
describe("lireLesAvisColles", () => {
  it("lit un collage Google : auteur au-dessus, note en étoiles, bruit intercalé", () => {
    const colle = `
Marie L.
Local Guide · 12 avis
★★★★★
il y a 2 mois
Toiture refaite en trois jours, chantier propre et devis respecté au centime.
Utile
Partager

Jean-Pierre Dubois
★★★★
il y a 1 an
Intervention rapide après la tempête, ils ont bâché le soir même.
Utile
`;
    const avis = lireLesAvisColles(colle, "Google");
    expect(avis).toHaveLength(2);
    expect(avis[0]).toMatchObject({ author: "Marie L.", rating: 5, source: "Google" });
    expect(avis[0].text).toContain("devis respecté");
    expect(avis[1]).toMatchObject({ author: "Jean-Pierre Dubois", rating: 4 });
  });

  it("lit une note écrite « 4,5/5 » aussi bien qu'en étoiles", () => {
    const avis = lireLesAvisColles(`
Sophie M.
4,5/5
Accueil chaleureux et travail soigné, je recommande sans réserve.
`);
    expect(avis[0].rating).toBe(5);
  });

  it("accepte le nom placé après le texte, comme sur un ancien site", () => {
    const avis = lireLesAvisColles(`
Chantier mené de bout en bout sans mauvaise surprise, je referais appel à eux.
Claire Fontaine
`);
    expect(avis).toHaveLength(1);
    expect(avis[0].author).toBe("Claire Fontaine");
  });

  it("garde un avis sans note et lui laisse cinq étoiles par défaut", () => {
    const avis = lireLesAvisColles(`
Patient vérifié
Médecin à l'écoute qui prend le temps d'expliquer, salle d'attente calme.
`, "Doctolib");
    expect(avis).toHaveLength(1);
    expect(avis[0].rating).toBe(5);
    expect(avis[0].source).toBe("Doctolib");
  });

  it("recolle un avis coupé en deux paragraphes", () => {
    const avis = lireLesAvisColles(`
Thomas B.
★★★★★
Ils sont intervenus un dimanche pour une fuite qui traversait le plafond.
Tout était réparé avant la nuit, et le tarif annoncé n'a pas bougé.
`);
    expect(avis).toHaveLength(1);
    expect(avis[0].text).toContain("dimanche");
    expect(avis[0].text).toContain("n'a pas bougé");
  });

  it("écarte les mentions d'interface sans les prendre pour des avis", () => {
    const avis = lireLesAvisColles(`
127 avis
Voir plus
Traduire
Réponse du propriétaire
Signaler
`);
    expect(avis).toHaveLength(0);
  });

  it("ne garde qu'une fois un avis collé en extrait puis en entier", () => {
    const avis = lireLesAvisColles(`
Léa R.
Travail impeccable et équipe ponctuelle, rien à redire sur…
Léa R.
Travail impeccable et équipe ponctuelle, rien à redire sur la finition des rives.
`);
    expect(avis).toHaveLength(1);
    expect(avis[0].text).toContain("finition des rives");
  });

  it("borne la note entre une et cinq étoiles", () => {
    const avis = lireLesAvisColles(`
Paul V.
Note : 9
Excellent accueil, prestations à la hauteur de ce qui était annoncé.
`);
    expect(avis[0].rating).toBeLessThanOrEqual(5);
    expect(avis[0].rating).toBeGreaterThanOrEqual(1);
  });

  it("ne rend rien pour un collage vide", () => {
    expect(lireLesAvisColles("")).toEqual([]);
    expect(lireLesAvisColles("   \n  \n ")).toEqual([]);
  });
});
