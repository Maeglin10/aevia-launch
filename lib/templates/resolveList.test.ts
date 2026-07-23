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

  it("returns real data unchanged when present", () => {
    const real = [{ title: "Vraie prestation", price: "45€" }];
    expect(resolveList(real, demo)).toBe(real);
  });
});
