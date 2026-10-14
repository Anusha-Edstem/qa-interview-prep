const DOLLAR_AMOUNT = /\$(\d+)\.(\d{2})/;

export function toCents(text: string): number {
  const match = DOLLAR_AMOUNT.exec(text);
  if (match === null) {
    throw new Error(`No dollar amount in "${text}"`);
  }
  return Number(match[1]) * 100 + Number(match[2]);
}

export function formatDollars(cents: number): string {
  const dollars = Math.floor(cents / 100);
  const remainder = String(cents % 100).padStart(2, "0");
  return `$${dollars}.${remainder}`;
}
