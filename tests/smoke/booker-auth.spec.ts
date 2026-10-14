import { test, expect } from "@fixtures/base";
import { booker } from "@config/env";

test("BOOK-01 POST /auth returns a token", { tag: "@smoke" }, async ({ bookerApi }) => {
  const response = await bookerApi.createToken({
    username: booker.username,
    password: booker.password,
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ token: expect.stringMatching(/^\w{8,}$/) });
});
