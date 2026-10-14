import type { Page } from "@playwright/test";

export type Fruit = {
  name: string;
  id: number;
};

export const fruitsApi = "**/api/v1/fruits";

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
