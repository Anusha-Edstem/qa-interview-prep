import { test, expect } from "@fixtures/base";
import { recordedFruitNames, replayFruitListFromHar } from "@data/fruits";

test(
  "MOCK-05 a recorded HAR replays the fruit list with the real API blocked",
  { tag: "@regression" },
  async ({ page, fruitsPage }) => {
    await replayFruitListFromHar(page);

    await fruitsPage.goto();

    await expect(fruitsPage.items()).toHaveText(recordedFruitNames());
  },
);
