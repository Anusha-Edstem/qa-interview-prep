import { test, expect } from "@fixtures/base";
import { slowHostTestTimeout } from "@config/timeouts";

test.use({ theInternetBasicAuth: true, trace: "off" });

test.describe("The Internet basic auth", { tag: "@smoke" }, () => {
  test.describe.configure({ timeout: slowHostTestTimeout });

  test("UI-09 basic auth through httpCredentials shows the congratulations message", async ({
    basicAuthPage,
  }) => {
    await basicAuthPage.goto();

    await expect(basicAuthPage.heading).toBeVisible();
    await expect(basicAuthPage.message).toHaveText("Congratulations! You must have the proper credentials.");
  });
});
