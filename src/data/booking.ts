import { randomInt, randomUUID } from "node:crypto";
import type { Booking } from "@api/booker";

const extras = ["Breakfast", "Late checkout", "Airport transfer", "Extra pillow"] as const;
const dayInMs = 24 * 60 * 60 * 1000;

function isoDate(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * dayInMs).toISOString().slice(0, 10);
}

function uniqueSuffix(): string {
  return `${Date.now().toString(36)}${randomUUID().replaceAll("-", "").slice(0, 8)}`;
}

export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const checkinOffset = randomInt(30, 365);
  return {
    firstname: `Guest${uniqueSuffix()}`,
    lastname: `Qa${uniqueSuffix()}`,
    totalprice: randomInt(50, 5000),
    depositpaid: randomInt(0, 2) === 1,
    bookingdates: {
      checkin: isoDate(checkinOffset),
      checkout: isoDate(checkinOffset + randomInt(1, 15)),
    },
    additionalneeds: extras[randomInt(0, extras.length)],
    ...overrides,
  };
}
