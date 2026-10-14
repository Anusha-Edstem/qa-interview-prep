import type { Locator, Page } from "@playwright/test";
import { openTheInternet } from "./openTheInternet";

export class NestedFramesPage {
  constructor(private readonly page: Page) {}

  get middleFrameContent(): Locator {
    return this.page
      .frameLocator('frame[name="frame-top"]')
      .frameLocator('frame[name="frame-middle"]')
      .locator("body");
  }

  async goto(): Promise<void> {
    await openTheInternet(this.page, "/nested_frames");
  }
}
