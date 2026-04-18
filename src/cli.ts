#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { flattenTokens } from "./parser";
import { generate } from "./generators";
import type { TokenGroup, OutputFormat } from "./types";

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
design-tokens — Transform design tokens into platform outputs

Usage:
  design-tokens <input> --format <css|scss|tailwind|ts|json> --out <path> [--prefix <prefix>]

Examples:
  design-tokens tokens/base.tokens.json --format css --out dist/variables.css
  design-tokens tokens/base.tokens.json --format tailwind --out dist/tokens.ts --prefix ds
  design-tokens tokens/base.tokens.json --format scss --out dist/_tokens.scss

Options:
  --format   Output format: css, scss, tailwind, ts, json
  --out      Output file path
  --prefix   CSS variable prefix (default: none)
  --help     Show this help message
`);
}

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

if (args.includes("--help") || args.length === 0) {
  printHelp();
  process.exit(0);
}

const inputPath = args[0];
const format = getArg("--format") as OutputFormat | undefined;
const outputPath = getArg("--out");
const prefix = getArg("--prefix") ?? "";

if (!inputPath || !format || !outputPath) {
  console.error("Error: --format and --out are required.");
  printHelp();
  process.exit(1);
}

const validFormats: OutputFormat[] = ["css", "scss", "tailwind", "ts", "json"];
if (!validFormats.includes(format)) {
  console.error(`Error: Invalid format "${format}". Valid: ${validFormats.join(", ")}`);
  process.exit(1);
}

const absoluteInput = path.resolve(inputPath);
if (!fs.existsSync(absoluteInput)) {
  console.error(`Error: Input file not found: ${absoluteInput}`);
  process.exit(1);
}

const raw = fs.readFileSync(absoluteInput, "utf-8");
const tokenGroup: TokenGroup = JSON.parse(raw);
const flatTokens = flattenTokens(tokenGroup, prefix);
const output = generate(flatTokens, format);

const absoluteOutput = path.resolve(outputPath);
fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
fs.writeFileSync(absoluteOutput, output, "utf-8");

console.log(`✓ Generated ${format} → ${outputPath} (${flatTokens.length} tokens)`);
