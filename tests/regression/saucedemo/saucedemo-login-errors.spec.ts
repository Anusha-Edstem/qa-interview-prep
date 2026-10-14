import { test, expect } from "@fixtures/base";
import { sauceDemo } from "@config/env";
import { wrongPasswordFor } from "@data/saucedemo";

test.use({ trace: "off" });

test.describe("Sauce Demo login errors", { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("AUTH-02 locked_out_user sees the locked-out error", async ({ page, loginPage }) => {
    await loginPage.login(sauceDemo.lockedOutUser, sauceDemo.password);

    await expect
      .poll(() => loginPage.error.allTextContents())
      .toEqual(["Epic sadface: Sorry, this user has been locked out."]);
    await expect(page).toHaveURL(loginPage.url);
  });

  test("AUTH-03 a wrong password shows the username/password mismatch error", async ({ loginPage }) => {
    await loginPage.login(sauceDemo.standardUser, wrongPasswordFor(sauceDemo.password));

    await expect
      .poll(() => loginPage.error.allTextContents())
      .toEqual(["Epic sadface: Username and password do not match any user in this service"]);
  });
});
