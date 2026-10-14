import { test, expect } from "@fixtures/base";
import { sauceDemo } from "@config/env";

test.use({ trace: "off" });

test(
  "AUTH-01 standard_user logs in and lands on the inventory",
  { tag: "@smoke" },
  async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(sauceDemo.standardUser, sauceDemo.password);

    await expect(page).toHaveURL(inventoryPage.url);
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.items.first()).toBeVisible();
  },
);
