import { test as setup, expect } from "@fixtures/base";
import { urls } from "@config/env";

for (const [name, url] of Object.entries(urls)) {
  setup(`${name} is reachable`, async ({ request }) => {
    const response = await request.get(url, { failOnStatusCode: false });
    expect(response.status(), `${name} at ${url}`).toBeLessThan(500);
  });
}
