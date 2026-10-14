import { defineConfig, devices } from "@playwright/test";
import { isCI, urls } from "./src/config/env";

const apiSpecs = /booker-.*\.spec\.ts$/;
const sauceDemoSpecs = /saucedemo-.*\.spec\.ts$/;

process.env.PLAYWRIGHT_NO_COPY_PROMPT = "1";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["blob"], ["github"], ["list"]] : [["list"], ["html", { open: "never" }]],
  use: {
    testIdAttribute: "data-test",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "setup", testDir: "src/setup", testMatch: /health\.ts$/ },
    {
      name: "chromium",
      testIgnore: apiSpecs,
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      testIgnore: apiSpecs,
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      testIgnore: apiSpecs,
      use: { ...devices["Desktop Safari"] },
      dependencies: ["setup"],
    },
    {
      name: "mobile-chrome",
      testMatch: sauceDemoSpecs,
      use: { ...devices["Pixel 7"] },
      dependencies: ["setup"],
    },
    {
      name: "api",
      testMatch: apiSpecs,
      use: { baseURL: urls.restfulBooker, trace: "off" },
      dependencies: ["setup"],
    },
  ],
});
