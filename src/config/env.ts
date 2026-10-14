import "dotenv/config";

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value.trim() === "" ? fallback : value.trim();
}

export function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in, or set it in the shell.`,
    );
  }
  return value.trim();
}

export const urls = {
  sauceDemo: optional("SAUCE_DEMO_URL", "https://www.saucedemo.com"),
  restfulBooker: optional("RESTFUL_BOOKER_URL", "https://restful-booker.herokuapp.com"),
  apiMocking: optional("API_MOCKING_URL", "https://demo.playwright.dev/api-mocking"),
  theInternet: optional("THE_INTERNET_URL", "https://the-internet.herokuapp.com"),
} as const;

export const sauceDemo = {
  get standardUser(): string {
    return required("SAUCE_STANDARD_USER");
  },
  get lockedOutUser(): string {
    return required("SAUCE_LOCKED_OUT_USER");
  },
  get password(): string {
    return required("SAUCE_PASSWORD");
  },
};

export const isCI = !!process.env.CI;
