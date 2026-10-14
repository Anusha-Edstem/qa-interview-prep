import { test, expect } from "@fixtures/base";

test("THROWAWAY deliberately failing test to produce a trace", { tag: "@smoke" }, async ({ fruitsPage }) => {
  await fruitsPage.goto();
  await expect(fruitsPage.heading()).toHaveText("This heading does not exist");
});
