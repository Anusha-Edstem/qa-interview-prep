import { test, expect } from "@fixtures/base";
import { fruitNames, knownRealFruit, mockFruitList, mockedFruits } from "@data/fruits";

test(
  "MOCK-01 a fully mocked fruit list replaces the real one",
  { tag: "@smoke" },
  async ({ page, fruitsPage }) => {
    await mockFruitList(page, mockedFruits);

    await fruitsPage.goto();

    await expect(fruitsPage.items()).toHaveText(fruitNames(mockedFruits));
    await expect(fruitsPage.item(knownRealFruit)).toBeHidden();
  },
);
