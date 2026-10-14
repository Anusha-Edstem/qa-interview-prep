import type { Locator, Page } from "@playwright/test";
import { urls } from "@config/env";

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.username = page.getByPlaceholder("Username");
    this.password = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.error = page.getByTestId("error");
  }

  get url(): string {
    return new URL("/", urls.sauceDemo).href;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.enterSecret(this.password, password);
    await this.loginButton.click();
  }

  private async enterSecret(field: Locator, value: string): Promise<void> {
    await field.evaluate((element, secret) => {
      const input = element as HTMLInputElement;
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setValue?.call(input, secret);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
  }
}
