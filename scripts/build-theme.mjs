#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_BRAND,
  DEFAULT_THEME,
  readBrandTokens,
  readThemeTokens,
} from "./lib/load-tokens.mjs";
import { generateThemeCss } from "./lib/generate-theme-css.mjs";
import { config as loadEnv } from "dotenv";

const OUTPUT_PATH = path.resolve(
  import.meta.dirname,
  "..",
  "src",
  "styles",
  "generated",
  "theme.css"
);

async function main() {
  loadEnv({ path: path.resolve(import.meta.dirname, "..", ".env") });

  const brand = process.env.NEXT_BOYNE_BRAND || DEFAULT_BRAND;
  const theme = process.env.NEXT_BOYNE_THEME || DEFAULT_THEME;

  if (!process.env.NEXT_BOYNE_BRAND) {
    console.warn(`[build-theme] NEXT_BOYNE_BRAND not set, defaulting to "${brand}"`);
  }
  if (!process.env.NEXT_BOYNE_THEME) {
    console.warn(`[build-theme] NEXT_BOYNE_THEME not set, defaulting to "${theme}"`);
  }

  const [brandTokens, themeTokens] = await Promise.all([
    readBrandTokens(brand),
    readThemeTokens(theme),
  ]);

  const css = generateThemeCss({ brand, theme, brandTokens, themeTokens });

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, css, "utf-8");

  console.log(`[build-theme] wrote ${path.relative(process.cwd(), OUTPUT_PATH)} (brand="${brand}", theme="${theme}")`);
}

main().catch((error) => {
  console.error("[build-theme] failed:", error.message);
  process.exit(1);
});
