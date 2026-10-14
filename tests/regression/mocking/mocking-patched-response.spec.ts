import { test, expect } from "@fixtures/base";
import { addedFruit, appendFruitToRealList, knownRealFruit } from "@data/fruits";

test(
  "MOCK-02 a real fruit response with one added item shows both",
  { tag: "@regression" },
  async ({ page, fruitsPage }) => {
    await appendFruitToRealList(page, addedFruit);

    await fruitsPage.goto();

    await expect(fruitsPage.item(knownRealFruit)).toBeVisible();
    await expect(fruitsPage.item(addedFruit.name)).toBeVisible();
    await expect(fruitsPage.items().last()).toHaveText(addedFruit.name);
  },
);
