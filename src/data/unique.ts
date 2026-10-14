import { randomUUID } from "node:crypto";

export function uniqueFileName(prefix: string, extension: string): string {
  return `${prefix}-${randomUUID()}.${extension}`;
}
