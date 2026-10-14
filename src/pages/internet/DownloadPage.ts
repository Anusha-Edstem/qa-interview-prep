import type { Download, Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";

export class DownloadPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole("heading", { name: "File Downloader" });
  }

  fileLink(fileName: string): Locator {
    return this.page.getByRole("link", { name: fileName, exact: true });
  }

  async goto(): Promise<void> {
    await openTheInternet(this.page, "/download");
  }

  async download(fileName: string): Promise<Download> {
    const downloadPromise = this.page.waitForEvent("download");
    await this.fileLink(fileName).click();
    return downloadPromise;
  }
}
