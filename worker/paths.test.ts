import { describe, expect, it } from "vitest";
import { isServableName } from "./paths";

describe("isServableName", () => {
  it("accepts a data file and a stored result", () => {
    expect(isServableName("rockridge.network.json")).toBe(true);
    expect(isServableName("results/rockridge/0123456789abcdef.json")).toBe(true);
    expect(isServableName("results/rockridge/index.json")).toBe(true);
  });
  it("rejects traversal, other folders and odd characters", () => {
    for (const n of ["", "..", "results/../x", "results/rockridge/..", "other/rockridge/x.json", "results//x.json", "results/a/b/c.json", "/results/a/x.json", "a b.json", "results/a/%2e%2e", "x".repeat(300)]) {
      expect(isServableName(n)).toBe(false);
    }
  });
});
