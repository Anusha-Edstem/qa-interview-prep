import { readFileSync } from "node:fs";
import path from "node:path";
import type { Page, Route } from "@playwright/test";
import { harUpdate } from "@config/env";

export type Fruit = {
  name: string;
  id: number;
};

type HarEntry = {
  request: { url: string };
  response: { content: { text?: string; encoding?: string } };
};

export const fruitsApi = "**/api/v1/fruits";

export const fruitsHarPath = path.join(__dirname, "har", "fruits.har");

export const knownRealFruit = "Strawberry";

export const mockedFruits: Fruit[] = [
  { name: "Mocked Durian", id: 9001 },
  { name: "Mocked Rambutan", id: 9002 },
  { name: "Mocked Mangosteen", id: 9003 },
];

export const addedFruit: Fruit = { name: "Added Jackfruit", id: 9100 };

export const slowResponseMs = 3_000;

export function fruitNames(fruits: Fruit[]): string[] {
  return fruits.map((fruit) => fruit.name);
}

export async function mockFruitList(page: Page, fruits: Fruit[]): Promise<void> {
  await page.route(fruitsApi, async (route) => {
    await route.fulfill({ json: fruits });
  });
}

export async function appendFruitToRealList(page: Page, fruit: Fruit): Promise<void> {
  await page.route(fruitsApi, async (route) => {
    const response = await route.fetch();
    const realFruits = (await response.json()) as Fruit[];
    await route.fulfill({ response, json: [...realFruits, fruit] });
  });
}

export async function failFruitList(page: Page): Promise<void> {
  await page.route(fruitsApi, async (route) => {
    await route.fulfill({ status: 500, contentType: "text/plain", body: "Internal Server Error" });
  });
}

export async function delayFruitList(page: Page, delayMs: number): Promise<void> {
  await page.route(fruitsApi, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.continue();
  });
}

async function blockRealFruitApi(route: Route): Promise<void> {
  await route.abort();
}

async function passThroughWhileRecording(route: Route): Promise<void> {
  await route.fallback();
}

export async function replayFruitListFromHar(page: Page): Promise<void> {
  await page.route(fruitsApi, harUpdate ? passThroughWhileRecording : blockRealFruitApi);
  await page.routeFromHAR(fruitsHarPath, {
    url: fruitsApi,
    notFound: "abort",
    update: harUpdate,
    updateContent: "embed",
    updateMode: "minimal",
  });
}

export function recordedFruitNames(): string[] {
  const har = JSON.parse(readFileSync(fruitsHarPath, "utf8")) as { log: { entries: HarEntry[] } };
  const entry = har.log.entries.find((candidate) => candidate.request.url.endsWith("/api/v1/fruits"));
  const text = entry?.response.content.text;
  if (text === undefined) {
    throw new Error(`No recorded fruit list in ${fruitsHarPath}. Re-record it with HAR_UPDATE=1.`);
  }
  const encoding = entry?.response.content.encoding === "base64" ? "base64" : "utf8";
  const names = fruitNames(JSON.parse(Buffer.from(text, encoding).toString("utf8")) as Fruit[]);
  if (names.length === 0) {
    throw new Error(`The recorded fruit list in ${fruitsHarPath} is empty.`);
  }
  return names;
}
