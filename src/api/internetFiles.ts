import type { APIRequestContext } from "@playwright/test";
import { urls } from "@config/env";
import { slowHostTimeout } from "@config/timeouts";

export async function seedUploadedFile(
  request: APIRequestContext,
  fileName: string,
  contents: string,
): Promise<void> {
  const response = await request.post(`${urls.theInternet}/upload`, {
    timeout: slowHostTimeout,
    multipart: {
      file: { name: fileName, mimeType: "text/plain", buffer: Buffer.from(contents) },
    },
  });
  if (!response.ok()) {
    throw new Error(`Seeding ${fileName} through POST /upload failed with HTTP ${response.status()}`);
  }
}
