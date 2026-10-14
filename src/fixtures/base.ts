import { test as base, expect, type APIResponse } from "@playwright/test";
import { BookerApi, type Booking, type CreatedBooking } from "@api/booker";
import { booker, sauceDemo, urls } from "@config/env";
import { buildBooking } from "@data/booking";
import { CartPage } from "@pages/saucedemo/cart-page";
import { CheckoutPage } from "@pages/saucedemo/checkout-page";
import { InventoryPage } from "@pages/saucedemo/inventory-page";
import { LoginPage } from "@pages/saucedemo/login-page";
import { FruitsPage } from "@pages/mocking/FruitsPage";

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  signedInInventoryPage: InventoryPage;
};

type MockingFixtures = {
  fruitsPage: FruitsPage;
};

export interface TrackedBookings {
  create(booking: Booking): Promise<APIResponse>;
}

export interface SeededBooking {
  id: number;
  data: Booking;
}

interface BookerFixtures {
  bookerApi: BookerApi;
  token: string;
  bookings: TrackedBookings;
  booking: SeededBooking;
}

const alreadyGone = new Set([201, 404, 405]);

export const test = base.extend<SauceDemoFixtures & BookerFixtures & MockingFixtures>({
  fruitsPage: async ({ page }, use) => {
    await use(new FruitsPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  signedInInventoryPage: async ({ context, inventoryPage }, use) => {
    await context.addCookies([
      { name: "session-username", value: sauceDemo.standardUser, url: urls.sauceDemo },
    ]);
    await inventoryPage.goto();
    await use(inventoryPage);
  },

  bookerApi: async ({ request }, use) => {
    await use(new BookerApi(request));
  },

  token: async ({ bookerApi }, use) => {
    const response = await bookerApi.createToken({
      username: booker.username,
      password: booker.password,
    });
    const body = (await response.json()) as { token?: string; reason?: string };
    if (body.token === undefined) {
      throw new Error(`POST /auth returned ${response.status()} without a token`);
    }
    await use(body.token);
  },

  bookings: async ({ bookerApi, token }, use) => {
    const created: number[] = [];
    await use({
      async create(booking) {
        const response = await bookerApi.createBooking(booking);
        if (response.ok()) {
          const body = (await response.json()) as CreatedBooking;
          created.push(body.bookingid);
        }
        return response;
      },
    });
    for (const id of created) {
      const response = await bookerApi.deleteBooking(id, token);
      if (!alreadyGone.has(response.status())) {
        throw new Error(`Cleanup of booking ${id} returned ${response.status()}`);
      }
    }
  },

  booking: async ({ bookings }, use) => {
    const data = buildBooking();
    const response = await bookings.create(data);
    if (!response.ok()) {
      throw new Error(`Seeding a booking returned ${response.status()}`);
    }
    const body = (await response.json()) as CreatedBooking;
    await use({ id: body.bookingid, data });
  },
});

export { expect };
