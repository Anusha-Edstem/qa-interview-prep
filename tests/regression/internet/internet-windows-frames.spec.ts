import { test, expect } from "@fixtures/base";
import { slowHostTestTimeout, slowHostTimeout } from "@config/timeouts";

test.describe("The Internet windows and frames", { tag: "@regression" }, () => {
  test.describe.configure({ timeout: slowHostTestTimeout });

  test("UI-07 a link opens a new tab, its heading is checked, focus returns", async ({ windowsPage }) => {
    await windowsPage.goto();

    const newWindow = await windowsPage.openNewWindow();
    await expect(newWindow.heading).toHaveText("New Window", { timeout: slowHostTimeout });

    await windowsPage.bringToFront();
    await expect(windowsPage.heading).toBeVisible();
  });

  test("UI-08 reading the middle nested frame", async ({ nestedFramesPage }) => {
    await nestedFramesPage.goto();

    await expect(nestedFramesPage.middleFrameContent).toHaveText("MIDDLE", { timeout: slowHostTimeout });
  });
});
