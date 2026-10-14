import { stat } from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@fixtures/base";
import { slowHostTestTimeout, slowHostTimeout } from "@config/timeouts";
import { uploadSampleFile } from "@data/files";

test.describe("The Internet files", { tag: "@regression" }, () => {
  test.describe.configure({ timeout: slowHostTestTimeout });

  test("UI-02 uploading a fixture file shows its name", async ({ uploadPage }) => {
    await uploadPage.goto();
    await uploadPage.upload(uploadSampleFile);

    await expect(uploadPage.uploadedHeading).toBeVisible({ timeout: slowHostTimeout });
    await expect(uploadPage.uploadedFiles).toHaveText(path.basename(uploadSampleFile));
  });

  test("UI-03 downloading a file keeps its name and is not empty", async ({
    downloadPage,
    seededDownloadFileName,
  }, testInfo) => {
    await downloadPage.goto();
    const expectedName = (await downloadPage.fileLink(seededDownloadFileName).innerText()).trim();

    const download = await downloadPage.download(seededDownloadFileName);
    expect(download.suggestedFilename()).toBe(expectedName);

    const savedPath = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(savedPath);
    const { size } = await stat(savedPath);
    expect(size).toBeGreaterThan(0);
  });
});
