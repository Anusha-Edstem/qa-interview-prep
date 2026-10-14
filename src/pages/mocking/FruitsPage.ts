import type { Locator, Page } from "@playwright/test";
import { urls } from "@config/env";

export class FruitsPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(urls.apiMocking);
  }

  heading(): Locator {
    return this.page.getByRole("heading", { name: "Render a List of Fruits" });
  }

  loadingIndicator(): Locator {
    return this.page.getByText("Loading...");
  }

  list(): Locator {
    return this.page.getByRole("list");
  }

  items(): Locator {
    return this.list().getByRole("listitem");
  }

  item(name: string): Locator {
    return this.items().getByText(name, { exact: true });
  }
}
