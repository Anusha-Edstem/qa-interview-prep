import type { APIRequestContext, APIResponse } from "@playwright/test";

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}

export interface Credentials {
  username: string;
  password: string;
}

export class BookerApi {
  constructor(private readonly request: APIRequestContext) {}

  createToken(credentials: Credentials): Promise<APIResponse> {
    return this.request.post("/auth", { headers: this.headers(), data: credentials });
  }

  createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post("/booking", { headers: this.headers(), data: booking });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, { headers: this.headers() });
  }

  updateBooking(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { headers: this.headers(token), data: booking });
  }

  patchBooking(id: number, changes: Partial<Booking>, token?: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { headers: this.headers(token), data: changes });
  }

  deleteBooking(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.headers(token) });
  }

  private headers(token?: string): Record<string, string> {
    const accept = { Accept: "application/json" };
    return token === undefined ? accept : { ...accept, Cookie: `token=${token}` };
  }
}
