import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.itemNames = this.items.getByTestId("inventory-item-name");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
