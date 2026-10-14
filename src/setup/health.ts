import { test as setup, expect } from "@fixtures/base";
import { urls } from "@config/env";

for (const [name, url] of Object.entries(urls)) {
  setup(`${name} is reachable`, async ({ request }) => {
    setup.setTimeout(90_000);
    await expect(async () => {
      const response = await request.get(url, { failOnStatusCode: false, timeout: 15_000 });
      expect(response.status(), `${name} at ${url}`).toBeLessThan(500);
    }).toPass({ timeout: 75_000 });
  });
}
