import type { Page, Response } from "@playwright/test";
import { urls } from "@config/env";

const maxNavigationAttempts = 3;

export async function openTheInternet(page: Page, path: string): Promise<void> {
  const url = `${urls.theInternet}${path}`;
  const failedAttempts: string[] = [];
  for (let attempt = 1; attempt <= maxNavigationAttempts; attempt += 1) {
    const serverErrors: string[] = [];
    const recordServerError = (response: Response): void => {
      if (response.status() >= 500) {
        serverErrors.push(`HTTP ${response.status()} ${response.url()}`);
      }
    };
    page.on("response", recordServerError);
    try {
      await page.goto(url, { waitUntil: "load" });
    } finally {
      page.off("response", recordServerError);
    }
    if (serverErrors.length === 0) {
      return;
    }
    failedAttempts.push(`attempt ${attempt}: ${serverErrors.join(", ")}`);
  }
  throw new Error(`The Internet could not serve ${url} intact:\n${failedAttempts.join("\n")}`);
}
