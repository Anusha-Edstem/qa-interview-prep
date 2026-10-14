import type { Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";
import { NewWindowPage } from "./NewWindowPage";

export class WindowsPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole("heading", { name: "Opening a new window" });
  }

  get newWindowLink(): Locator {
    return this.page.getByRole("link", { name: "Click Here" });
  }

  async goto(): Promise<void> {
    await openTheInternet(this.page, "/windows");
  }

  async openNewWindow(): Promise<NewWindowPage> {
    const newPagePromise = this.page.context().waitForEvent("page");
    await this.newWindowLink.click();
    return new NewWindowPage(await newPagePromise);
  }

  async bringToFront(): Promise<void> {
    await this.page.bringToFront();
  }
}
