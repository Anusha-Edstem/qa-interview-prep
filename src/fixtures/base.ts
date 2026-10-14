import { test as base, expect, type Page } from "@playwright/test";
import { theInternet, urls } from "@config/env";
import { seedUploadedFile } from "@api/internetFiles";
import { uniqueFileName } from "@data/unique";
import { BasicAuthPage } from "@pages/internet/BasicAuthPage";
import { DownloadPage } from "@pages/internet/DownloadPage";
import { DynamicLoadingPage } from "@pages/internet/DynamicLoadingPage";
import { JavaScriptAlertsPage } from "@pages/internet/JavaScriptAlertsPage";
import { NestedFramesPage } from "@pages/internet/NestedFramesPage";
import { UploadPage } from "@pages/internet/UploadPage";
import { WindowsPage } from "@pages/internet/WindowsPage";

type TheInternetOptions = {
  theInternetBasicAuth: boolean;
};

type TheInternetFixtures = {
  theInternetPage: Page;
  dynamicLoadingPage: DynamicLoadingPage;
  uploadPage: UploadPage;
  downloadPage: DownloadPage;
  javaScriptAlertsPage: JavaScriptAlertsPage;
  windowsPage: WindowsPage;
  nestedFramesPage: NestedFramesPage;
  basicAuthPage: BasicAuthPage;
  seededDownloadFileName: string;
};

function isTheInternetNoise(url: URL): boolean {
  return url.hostname.endsWith("optimizely.com") || /\/(js\/vendor\/\d+\.js|img\/)/.test(url.pathname);
}

export const test = base.extend<TheInternetFixtures & TheInternetOptions>({
  theInternetBasicAuth: [false, { option: true }],
  httpCredentials: async ({ theInternetBasicAuth, httpCredentials }, use) => {
    await use(
      theInternetBasicAuth
        ? {
            username: theInternet.basicAuthUsername,
            password: theInternet.basicAuthPassword,
            origin: new URL(urls.theInternet).origin,
          }
        : httpCredentials,
    );
  },
  theInternetPage: async ({ context, page }, use) => {
    await context.route(isTheInternetNoise, (route) => route.abort());
    await use(page);
  },
  dynamicLoadingPage: async ({ theInternetPage }, use) => {
    await use(new DynamicLoadingPage(theInternetPage));
  },
  uploadPage: async ({ theInternetPage }, use) => {
    await use(new UploadPage(theInternetPage));
  },
  downloadPage: async ({ theInternetPage }, use) => {
    await use(new DownloadPage(theInternetPage));
  },
  javaScriptAlertsPage: async ({ theInternetPage }, use) => {
    await use(new JavaScriptAlertsPage(theInternetPage));
  },
  windowsPage: async ({ theInternetPage }, use) => {
    await use(new WindowsPage(theInternetPage));
  },
  nestedFramesPage: async ({ theInternetPage }, use) => {
    await use(new NestedFramesPage(theInternetPage));
  },
  basicAuthPage: async ({ theInternetPage }, use) => {
    await use(new BasicAuthPage(theInternetPage));
  },
  seededDownloadFileName: async ({ request }, use) => {
    const fileName = uniqueFileName("download-seed", "txt");
    await seedUploadedFile(request, fileName, `Seeded download ${fileName}\n`);
    await use(fileName);
  },
});

export { expect };
