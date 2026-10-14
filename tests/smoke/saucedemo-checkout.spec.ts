import { test, expect } from "@fixtures/base";
import { buildCustomer, checkoutItems } from "@data/saucedemo";
import { formatDollars } from "@utils/money";

test(
  "CHK-01 two items in the cart check out with an item total equal to the sum of their prices",
  { tag: "@smoke" },
  async ({ signedInInventoryPage, cartPage, checkoutPage }) => {
    await expect(signedInInventoryPage.title).toHaveText("Products");
    await signedInInventoryPage.addToCart(checkoutItems);
    await expect(signedInInventoryPage.cartBadge).toHaveText("2");

    await signedInInventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([...checkoutItems]);

    await cartPage.checkout();
    await checkoutPage.submitInformation(buildCustomer());
    await expect(checkoutPage.title).toHaveText("Checkout: Overview");
    await expect(checkoutPage.itemNames).toHaveText([...checkoutItems]);

    const prices = await checkoutPage.itemPricesInCents();
    const expectedTotal = prices.reduce((sum, price) => sum + price, 0);
    await expect(checkoutPage.itemTotal).toHaveText(`Item total: ${formatDollars(expectedTotal)}`);

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText("Thank you for your order!");
  },
);
