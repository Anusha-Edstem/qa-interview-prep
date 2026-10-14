import { test, expect } from "@fixtures/base";
import { buildBooking } from "@data/booking";
import type { CreatedBooking } from "@api/booker";

test("BOOK-02 a created booking reads back as sent", { tag: "@smoke" }, async ({ bookerApi, bookings }) => {
  const sent = buildBooking();

  const created = await bookings.create(sent);
  expect(created.status()).toBe(200);
  const body = (await created.json()) as CreatedBooking;
  expect(body).toEqual({ bookingid: expect.any(Number), booking: sent });

  const read = await bookerApi.getBooking(body.bookingid);
  expect(read.status()).toBe(200);
  expect(await read.json()).toEqual(sent);
});
