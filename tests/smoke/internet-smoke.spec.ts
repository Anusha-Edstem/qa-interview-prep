import { test, expect } from "@fixtures/base";
import { slowHostTestTimeout, slowHostTimeout } from "@config/timeouts";

test.describe("The Internet dynamic loading", { tag: "@smoke" }, () => {
  test.describe.configure({ timeout: slowHostTestTimeout });

  test("UI-01 dynamic loading shows Hello World! after Start", async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.gotoRenderedAfterTheFact();
    await dynamicLoadingPage.start();

    await expect(dynamicLoadingPage.finishMessage).toBeVisible({ timeout: slowHostTimeout });
    await expect(dynamicLoadingPage.finishMessage).toHaveText("Hello World!");
  });
});
