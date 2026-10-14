import type { Locator, Page } from "@playwright/test";
import { urls } from "@config/env";

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.cartLink = page.getByTestId("shopping-cart-link");
  }

  get url(): string {
    return new URL("/inventory.html", urls.sauceDemo).href;
  }

  item(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async addToCart(names: readonly string[]): Promise<void> {
    for (const name of names) {
      await this.item(name).getByRole("button", { name: "Add to cart" }).click();
    }
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
