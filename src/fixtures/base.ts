import { test as base, expect } from "@playwright/test";
import { sauceDemo, urls } from "@config/env";
import { CartPage } from "@pages/saucedemo/cart-page";
import { CheckoutPage } from "@pages/saucedemo/checkout-page";
import { InventoryPage } from "@pages/saucedemo/inventory-page";
import { LoginPage } from "@pages/saucedemo/login-page";

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  signedInInventoryPage: InventoryPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  signedInInventoryPage: async ({ context, inventoryPage }, use) => {
    await context.addCookies([
      { name: "session-username", value: sauceDemo.standardUser, url: urls.sauceDemo },
    ]);
    await inventoryPage.goto();
    await use(inventoryPage);
  },
});

export { expect };
