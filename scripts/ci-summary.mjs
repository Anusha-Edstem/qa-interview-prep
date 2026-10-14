import { readFileSync } from "node:fs";
import process from "node:process";

const [, , file = "results.json"] = process.argv;
const report = JSON.parse(readFileSync(file, "utf8"));
const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = report.stats ?? {};

const titlesWith = (outcome) => {
  const found = [];
  const walk = (suite, trail) => {
    for (const child of suite.suites ?? []) walk(child, [...trail, child.title]);
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        if (test.status === outcome)
          found.push(`${test.projectName} › ${[...trail, spec.title].join(" › ")}`);
      }
    }
  };
  for (const suite of report.suites ?? []) walk(suite, [suite.title]);
  return found;
};

const lines = [
  "## Playwright results",
  "",
  "| Passed | Failed | Flaky | Skipped | Duration |",
  "| --- | --- | --- | --- | --- |",
  `| ${expected} | ${unexpected} | ${flaky} | ${skipped} | ${Math.round(duration / 1000)}s |`,
];

for (const [heading, outcome] of [
  ["Failed", "unexpected"],
  ["Flaky", "flaky"],
]) {
  const titles = titlesWith(outcome);
  if (titles.length > 0) lines.push("", `### ${heading}`, "", ...titles.map((title) => `- ${title}`));
}

process.stdout.write(`${lines.join("\n")}\n`);
