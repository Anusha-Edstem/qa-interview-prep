import { test, expect } from "@fixtures/base";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

test(
  "BOOK-03 GET /booking/{id} has every required field with the right type",
  { tag: "@regression" },
  async ({ bookerApi, booking }) => {
    const response = await bookerApi.getBooking(booking.id);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    const body: unknown = await response.json();
    expect(body).toEqual({
      firstname: expect.any(String),
      lastname: expect.any(String),
      totalprice: expect.any(Number),
      depositpaid: expect.any(Boolean),
      bookingdates: {
        checkin: expect.stringMatching(isoDate),
        checkout: expect.stringMatching(isoDate),
      },
      additionalneeds: expect.any(String),
    });
    expect(body).toEqual(booking.data);
  },
);
