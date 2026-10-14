import { test as base, expect } from "@playwright/test";
import { FruitsPage } from "@pages/mocking/FruitsPage";

type Fixtures = {
  fruitsPage: FruitsPage;
};

export const test = base.extend<Fixtures>({
  fruitsPage: async ({ page }, use) => {
    await use(new FruitsPage(page));
  },
});

export { expect };
