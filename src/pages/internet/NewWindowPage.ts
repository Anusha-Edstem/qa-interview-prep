import type { Locator, Page } from "@playwright/test";

export class NewWindowPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole("heading", { level: 3 });
  }
}
