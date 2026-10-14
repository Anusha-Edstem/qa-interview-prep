import { test, expect } from "@fixtures/base";

test(
  "BOOK-06 DELETE with a token answers 201 Created, then reading the booking returns 404",
  { tag: "@regression" },
  async ({ bookerApi, booking, token }) => {
    const deleted = await bookerApi.deleteBooking(booking.id, token);
    expect(deleted.status()).toBe(201);
    expect(await deleted.text()).toBe("Created");

    const read = await bookerApi.getBooking(booking.id);
    expect(read.status()).toBe(404);
    expect(await read.text()).toBe("Not Found");
  },
);
