import { test, expect } from "@fixtures/base";
import { buildBooking } from "@data/booking";

test(
  "BOOK-04 PUT with a token replaces the whole booking",
  { tag: "@regression" },
  async ({ bookerApi, booking, token }) => {
    const replacement = buildBooking({ depositpaid: !booking.data.depositpaid });

    const updated = await bookerApi.updateBooking(booking.id, replacement, token);
    expect(updated.status()).toBe(200);
    expect(await updated.json()).toEqual(replacement);

    const read = await bookerApi.getBooking(booking.id);
    expect(read.status()).toBe(200);
    expect(await read.json()).toEqual(replacement);
  },
);

test(
  "BOOK-05 PATCH with a token changes only the sent fields",
  { tag: "@regression" },
  async ({ bookerApi, booking, token }) => {
    const changes = {
      firstname: buildBooking().firstname,
      totalprice: booking.data.totalprice + 1,
    };
    const expected = { ...booking.data, ...changes };

    const patched = await bookerApi.patchBooking(booking.id, changes, token);
    expect(patched.status()).toBe(200);
    expect(await patched.json()).toEqual(expected);

    const read = await bookerApi.getBooking(booking.id);
    expect(read.status()).toBe(200);
    expect(await read.json()).toEqual(expected);
  },
);
