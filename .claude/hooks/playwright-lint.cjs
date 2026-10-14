"use strict";

const path = require("path");
const fs = require("fs");
const {
  readPayload,
  allow,
  surfaceToModel,
  extractFileEdit,
  projectRoot,
  insideProject,
  runLint,
} = require("./_util.cjs");

const LINTED = /^(?:tests|src)[\/]|^playwright\.config\.ts$/;

const LINTER = {
  command: "npx",
  args: ["eslint", "--max-warnings=0"],
  passFile: true,
  requires: "node_modules",
};

function main() {
  const payload = readPayload();
  const edit = extractFileEdit(payload);
  if (!edit) allow();

  const root = projectRoot(payload);
  if (!insideProject(root, edit.filePath)) allow();

  const relative = path.relative(root, path.resolve(root, edit.filePath)).replace(/\\/g, "/");
  if (!LINTED.test(relative) && !LINTED.test(relative.replace(/\//g, path.sep))) allow();
  if (LINTER.requires && !fs.existsSync(path.join(root, LINTER.requires))) allow();

  const args = LINTER.passFile ? LINTER.args.concat([relative]) : LINTER.args;
  const output = runLint(root, LINTER.command, args);
  if (!output) allow();

  surfaceToModel(`Lint reported problems in ${relative}. Fix them now; CI runs the same check.\n\n${output}`);
}

main();
