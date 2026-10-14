import { randomUUID } from "node:crypto";

export type Customer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const checkoutItems = ["Sauce Labs Backpack", "Sauce Labs Bike Light"] as const;

function uniqueSuffix(): string {
  return randomUUID().slice(0, 8);
}

export function buildCustomer(): Customer {
  return {
    firstName: "Ada",
    lastName: `Tester-${uniqueSuffix()}`,
    postalCode: "10001",
  };
}

export function wrongPasswordFor(password: string): string {
  return `${password}-${uniqueSuffix()}`;
}
