import { test, expect } from "@fixtures/base";
import { buildBooking } from "@data/booking";

test(
  "BOOK-07 PUT without a token is rejected with 403 and the booking is unchanged",
  { tag: "@regression" },
  async ({ bookerApi, booking }) => {
    const rejected = await bookerApi.updateBooking(booking.id, buildBooking());
    expect(rejected.status()).toBe(403);
    expect(await rejected.text()).toBe("Forbidden");

    const read = await bookerApi.getBooking(booking.id);
    expect(await read.json()).toEqual(booking.data);
  },
);

test(
  "BOOK-07 PATCH without a token is rejected with 403 and the booking is unchanged",
  { tag: "@regression" },
  async ({ bookerApi, booking }) => {
    const rejected = await bookerApi.patchBooking(booking.id, {
      firstname: buildBooking().firstname,
    });
    expect(rejected.status()).toBe(403);
    expect(await rejected.text()).toBe("Forbidden");

    const read = await bookerApi.getBooking(booking.id);
    expect(await read.json()).toEqual(booking.data);
  },
);
