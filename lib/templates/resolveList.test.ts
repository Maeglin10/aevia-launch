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

  it("keeps the client's values and fills presentation fields from demo", () => {
    // Le contrat a changé : resolveList fusionne désormais chaque ligne
    // (démo puis client) pour que les champs de présentation — icône, image,
    // couleur — que le client ne fournit jamais ne partent pas indéfinis
    // (React #130, la page d'un vrai client ne s'affichait pas du tout).
    const demoRich = [{ title: "Demo Service A", price: "0€", icon: "★" }];
    const real = [{ title: "Vraie prestation", price: "45€" }];
    expect(resolveList(real, demoRich)).toEqual([
      { title: "Vraie prestation", price: "45€", icon: "★" },
    ]);
  });

  it("loops demo presentation fields when the client has more rows", () => {
    const demoRich = [{ icon: "★" }, { icon: "☆" }];
    const real = [{ title: "A" }, { title: "B" }, { title: "C" }];
    expect(resolveList(real, demoRich)).toEqual([
      { icon: "★", title: "A" },
      { icon: "☆", title: "B" },
      { icon: "★", title: "C" },
    ]);
  });

  it("leaves string arrays untouched (no char-indexed objects)", () => {
    const real = ["Décennale", "RGE"];
    expect(resolveList(real, ["Demo label"])).toEqual(["Décennale", "RGE"]);
  });
});
