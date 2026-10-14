import type { Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";

export class JavaScriptAlertsPage {
  constructor(private readonly page: Page) {}

  get confirmButton(): Locator {
    return this.page.getByRole("button", { name: "Click for JS Confirm" });
  }

  get promptButton(): Locator {
    return this.page.getByRole("button", { name: "Click for JS Prompt" });
  }

  get result(): Locator {
    return this.page.locator("#result");
  }

  async goto(): Promise<void> {
    await openTheInternet(this.page, "/javascript_alerts");
  }

  async acceptConfirm(): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.confirmButton.click();
  }

  async dismissConfirm(): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.dismiss());
    await this.confirmButton.click();
  }

  async answerPrompt(text: string): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept(text));
    await this.promptButton.click();
  }
}
