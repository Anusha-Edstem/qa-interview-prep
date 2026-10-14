import { test, expect } from "@fixtures/base";
import { slowHostTestTimeout } from "@config/timeouts";

test.describe("The Internet JavaScript dialogs", { tag: "@regression" }, () => {
  test.describe.configure({ timeout: slowHostTestTimeout });

  test.beforeEach(async ({ javaScriptAlertsPage }) => {
    await javaScriptAlertsPage.goto();
  });

  test("UI-04 accepting a confirm reports Ok", async ({ javaScriptAlertsPage }) => {
    await javaScriptAlertsPage.acceptConfirm();

    await expect(javaScriptAlertsPage.result).toHaveText("You clicked: Ok");
  });

  test("UI-05 dismissing a confirm reports Cancel", async ({ javaScriptAlertsPage }) => {
    await javaScriptAlertsPage.dismissConfirm();

    await expect(javaScriptAlertsPage.result).toHaveText("You clicked: Cancel");
  });

  test("UI-06 typing into a prompt echoes the text", async ({ javaScriptAlertsPage }) => {
    const answer = "Playwright prompt answer";

    await javaScriptAlertsPage.answerPrompt(answer);

    await expect(javaScriptAlertsPage.result).toHaveText(`You entered: ${answer}`);
  });
});
