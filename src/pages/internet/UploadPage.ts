import type { Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";

export class UploadPage {
  constructor(private readonly page: Page) {}

  get fileInput(): Locator {
    return this.page.locator("#file-upload");
  }

  get uploadButton(): Locator {
    return this.page.getByRole("button", { name: "Upload" });
  }

  get uploadedHeading(): Locator {
    return this.page.getByRole("heading", { name: "File Uploaded!" });
  }

  get uploadedFiles(): Locator {
    return this.page.locator("#uploaded-files");
  }

  async goto(): Promise<void> {
    await openTheInternet(this.page, "/upload");
  }

  async upload(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }
}
