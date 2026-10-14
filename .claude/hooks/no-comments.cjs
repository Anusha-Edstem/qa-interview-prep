"use strict";

const path = require("path");
const { readPayload, block, allow, extractFileEdit, textAfterEdit, readFileOr, projectRoot } = require("./_util.cjs");

const C_LIKE = /\.(?:ts|tsx|js|jsx|mjs|cjs|java|kt|kts|cs|go|swift|dart|scala|groovy)$/i;
const HASH_LIKE = /\.(?:py|rb|sh)$/i;

const DIRECTIVE =
  /^(?:\/\s*<reference\b|eslint-(?:disable|enable|env)\b|prettier-ignore\b|@ts-(?:ignore|expect-error|nocheck|check)\b|istanbul\s+ignore\b|[cv]8\s+ignore\b|noinspection\s|noqa\b|type:\s*ignore\b|(?:pylint|mypy|flake8|rubocop):)/i;

function isDirective(body) {
  return DIRECTIVE.test(body.trim());
}

const REGEX_BEFORE = /[(,=:[!&|?{};+\-*%~^>\n]/;

const REGEX_KEYWORDS = new Set([
  "return",
  "typeof",
  "instanceof",
  "in",
  "of",
  "case",
  "do",
  "else",
  "yield",
  "await",
  "new",
  "delete",
  "void",
  "throw",
]);

function scanCLike(text) {
  const found = [];
  let index = 0;
  let line = 1;
  let previous = "\n";
  let previousWord = "";
  const length = text.length;

  while (index < length) {
    const char = text[index];
    const next = text[index + 1];

    if (/[A-Za-z_$]/.test(char)) {
      let end = index;
      while (end < length && /[A-Za-z0-9_$]/.test(text[end])) end += 1;
      previousWord = text.slice(index, end);
      previous = text[end - 1];
      index = end;
      continue;
    }

    if (char === "\n") {
      line += 1;
      index += 1;
      previous = "\n";
      previousWord = "";
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      index += 1;
      while (index < length) {
        if (text[index] === "\\") {
          index += 2;
          continue;
        }
        if (text[index] === "\n") line += 1;
        if (text[index] === quote) {
          index += 1;
          break;
        }
        index += 1;
      }
      previous = quote;
      continue;
    }

    if (char === "/" && next === "/") {
      const end = text.indexOf("\n", index);
      const stop = end === -1 ? length : end;
      found.push({ line, body: text.slice(index + 2, stop) });
      index = stop;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = text.indexOf("*/", index + 2);
      const stop = end === -1 ? length : end + 2;
      const body = text.slice(index + 2, end === -1 ? length : end);
      found.push({ line, body });
      line += body.split("\n").length - 1;
      index = stop;
      continue;
    }

    if (char === "/" && (REGEX_BEFORE.test(previous) || REGEX_KEYWORDS.has(previousWord))) {
      index += 1;
      let inClass = false;
      while (index < length) {
        const current = text[index];
        if (current === "\\") {
          index += 2;
          continue;
        }
        if (current === "\n") {
          index += 1;
          break;
        }
        if (current === "[") inClass = true;
        else if (current === "]") inClass = false;
        else if (current === "/" && !inClass) {
          index += 1;
          break;
        }
        index += 1;
      }
      previous = "/";
      previousWord = "";
      continue;
    }

    if (!/\s/.test(char)) {
      previous = char;
      previousWord = "";
    }
    index += 1;
  }

  return found;
}

function scanHashLike(text) {
  const found = [];
  text.split(/\r?\n/).forEach((raw, offset) => {
    if (offset === 0 && raw.startsWith("#!")) return;
    let inside = "";
    for (let i = 0; i < raw.length; i += 1) {
      const char = raw[i];
      if (inside) {
        if (char === "\\") i += 1;
        else if (char === inside) inside = "";
        continue;
      }
      if (char === '"' || char === "'") {
        inside = char;
        continue;
      }
      if (char === "#") {
        found.push({ line: offset + 1, body: raw.slice(i + 1) });
        return;
      }
    }
  });
  return found;
}

function comments(filePath, text) {
  const scan = C_LIKE.test(filePath) ? scanCLike : HASH_LIKE.test(filePath) ? scanHashLike : null;
  if (!scan) return null;
  return scan(text).filter((entry) => !isDirective(entry.body));
}

function tally(entries) {
  const counts = new Map();
  for (const entry of entries) {
    const key = entry.body.trim();
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function main() {
  const payload = readPayload();
  const edit = extractFileEdit(payload);
  if (!edit) allow();

  const root = projectRoot(payload);
  const absolute = path.resolve(root, edit.filePath);
  const current = readFileOr(absolute, "");
  const existing = comments(absolute, current);
  if (existing === null) allow();

  const proposed = comments(absolute, textAfterEdit(current, edit.input));
  const before = tally(existing);
  const added = proposed.filter((entry) => {
    const key = entry.body.trim();
    const remaining = before.get(key) || 0;
    if (remaining === 0) return true;
    before.set(key, remaining - 1);
    return false;
  });

  if (added.length === 0) allow();

  const listed = added
    .slice(0, 10)
    .map((entry) => `  line ${entry.line}: ${entry.body.trim().slice(0, 70)}`)
    .join("\n");

  block(
    `Refused: this write adds ${added.length} comment${added.length === 1 ? "" : "s"} to ` +
      `${path.relative(root, absolute) || edit.filePath}.\n${listed}\n\n` +
      "A source file contains code. Code that needs narration is poor implementation: the fix is a " +
      "better name, a smaller unit or an explicit type. Knowledge that is not the code belongs in " +
      "the commit message, the issue or a test name. See .claude/conventions/comment-conventions.md.",
  );
}

main();
