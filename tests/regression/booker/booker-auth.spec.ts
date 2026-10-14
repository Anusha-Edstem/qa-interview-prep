import { test, expect } from "@fixtures/base";
import { booker } from "@config/env";

test(
  "BOOK-01 POST /auth with a wrong password answers 200 with Bad credentials and no token",
  { tag: "@regression" },
  async ({ bookerApi }) => {
    const response = await bookerApi.createToken({
      username: booker.username,
      password: `not-${booker.password}`,
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ reason: "Bad credentials" });
  },
);
