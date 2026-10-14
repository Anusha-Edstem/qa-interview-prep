import type { Locator, Page } from "@playwright/test";
import type { Customer } from "@data/saucedemo";
import { toCents } from "@utils/money";

export class CheckoutPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemTotal: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId("title");
    this.firstName = page.getByPlaceholder("First Name");
    this.lastName = page.getByPlaceholder("Last Name");
    this.postalCode = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.items = page.getByTestId("inventory-item");
    this.itemNames = this.items.getByTestId("inventory-item-name");
    this.itemPrices = this.items.getByTestId("inventory-item-price");
    this.itemTotal = page.getByTestId("subtotal-label");
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.completeHeader = page.getByTestId("complete-header");
  }

  async submitInformation(customer: Customer): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async itemPricesInCents(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map(toCents);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
