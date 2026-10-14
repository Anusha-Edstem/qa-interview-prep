import type { Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";

export class DynamicLoadingPage {
  constructor(private readonly page: Page) {}

  get startButton(): Locator {
    return this.page.getByRole("button", { name: "Start" });
  }

  get finishMessage(): Locator {
    return this.page.locator("#finish");
  }

  async gotoRenderedAfterTheFact(): Promise<void> {
    await openTheInternet(this.page, "/dynamic_loading/2");
  }

  async start(): Promise<void> {
    await this.startButton.click();
  }
}
