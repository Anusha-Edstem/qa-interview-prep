import type { Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";

export class BasicAuthPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole("heading", { name: "Basic Auth" });
  }

  get message(): Locator {
    return this.page.getByText("Congratulations!");
  }

  async goto(): Promise<void> {
    await openTheInternet(this.page, "/basic_auth");
  }
}
