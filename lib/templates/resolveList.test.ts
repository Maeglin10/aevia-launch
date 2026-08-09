import { describe, it, expect } from "vitest";
import { resolveList } from "./resolveList";

describe("resolveList", () => {
  const demo = [
    { title: "Demo Service A", price: "0€" },
    { title: "Demo Service B", price: "0€" },
  ];

  it("returns demo data when real data is undefined", () => {
    expect(resolveList(undefined, demo)).toBe(demo);
  });

  it("returns demo data when real data is an empty array", () => {
    expect(resolveList([], demo)).toBe(demo);
  });

  it("garde ce que le client a écrit, et complète le reste avec la démonstration", () => {
    /*
      La ligne du thème porte aussi une icône, une couleur, une image, que le
      client ne saisit jamais. Rendre son tableau tel quel laissait `icon`
      indéfini et React levait l'erreur #130 : la page d'un vrai client ne
      s'affichait pas du tout. La fusion est donc voulue, et ce test la décrit.
    */
    const demoRiche = [{ title: "Demo Service A", price: "0€", icon: "Wrench" }];
    const real = [{ title: "Vraie prestation", price: "45€" }];
    expect(resolveList(real, demoRiche)).toEqual([
      { title: "Vraie prestation", price: "45€", icon: "Wrench" },
    ]);
  });

  it("ne transforme pas une chaîne en objet indexé par caractère", () => {
    /*
      Plusieurs sections sont des tableaux de chaînes — engagements, zones
      d'intervention. Les étaler ferait de « Décennale » un { 0: "D", 1: "é" }.
    */
    expect(resolveList(["Décennale", "RGE"], ["Qualibat"])).toEqual(["Décennale", "RGE"]);
  });

  it("répète la démonstration quand le client a plus d'entrées", () => {
    const demoCourte = [{ title: "A", icon: "Un" }];
    const real = [{ title: "X" }, { title: "Y" }];
    expect(resolveList(real, demoCourte)).toEqual([
      { title: "X", icon: "Un" },
      { title: "Y", icon: "Un" },
    ]);
  });
});
