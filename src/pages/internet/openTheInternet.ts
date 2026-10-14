import type { Page } from "@playwright/test";
import { urls } from "@config/env";

const maxNavigationAttempts = 3;

export async function openTheInternet(page: Page, path: string): Promise<void> {
  const url = `${urls.theInternet}${path}`;
  const statuses: number[] = [];
  for (let attempt = 1; attempt <= maxNavigationAttempts; attempt += 1) {
    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    const status = response?.status() ?? 0;
    if (status > 0 && status < 500) {
      return;
    }
    statuses.push(status);
  }
  throw new Error(`The Internet kept failing to serve ${url}: HTTP ${statuses.join(", ")}`);
}
