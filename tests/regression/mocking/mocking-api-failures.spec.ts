import { test, expect } from "@fixtures/base";
import { delayFruitList, failFruitList, fruitsApi, knownRealFruit, slowResponseMs } from "@data/fruits";

test(
  "MOCK-03 a 500 from the fruit API leaves the page loading with no list",
  { tag: "@regression" },
  async ({ page, fruitsPage }) => {
    await failFruitList(page);
    const failedResponse = page.waitForResponse(fruitsApi);

    await fruitsPage.goto();

    await failedResponse;
    await expect(fruitsPage.heading()).toBeVisible();
    await expect(fruitsPage.loadingIndicator()).toBeVisible();
    await expect(fruitsPage.list()).toHaveCount(0);
  },
);

test(
  "MOCK-04 a fruit API that takes 3 seconds shows loading, then the list",
  { tag: "@regression" },
  async ({ page, fruitsPage }) => {
    await delayFruitList(page, slowResponseMs);

    await fruitsPage.goto();

    await expect(fruitsPage.loadingIndicator()).toBeVisible();
    await expect(fruitsPage.items()).toHaveCount(0);
    await expect(fruitsPage.item(knownRealFruit)).toBeVisible({ timeout: slowResponseMs + 7_000 });
    await expect(fruitsPage.loadingIndicator()).toBeHidden();
  },
);
