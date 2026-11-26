#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_BRAND,
  DEFAULT_THEME,
  listBrandNames,
  listThemeNames,
  readBrandTokens,
  readThemeTokens,
} from "./lib/load-tokens.mjs";
import { generateStorybookThemeCss } from "./lib/generate-theme-css.mjs";

// Storybook-only output: every brand x theme combination, switchable at
// runtime via [data-brand]/[data-theme] attributes (see .storybook/preview.tsx).
// The Next.js app is untouched — it keeps building src/styles/generated/theme.css
// from a single brand/theme via scripts/build-theme.mjs + env vars.
const OUTPUT_PATH = path.resolve(
  import.meta.dirname,
  "..",
  "src",
  "styles",
  "generated",
  "theme.storybook.css"
);

async function main() {
  const [brandNames, themeNames] = await Promise.all([listBrandNames(), listThemeNames()]);

  const brands = await Promise.all(
    brandNames.map(async (name) => ({ name, tokens: await readBrandTokens(name) }))
  );
  const themes = await Promise.all(
    themeNames.map(async (name) => ({ name, tokens: await readThemeTokens(name) }))
  );

  const css = generateStorybookThemeCss({
    brands,
    themes,
    defaultBrand: DEFAULT_BRAND,
    defaultTheme: DEFAULT_THEME,
  });

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, css, "utf-8");

  console.log(
    `[build-theme-storybook] wrote ${path.relative(process.cwd(), OUTPUT_PATH)} ` +
      `(brands=${brandNames.join(",")}; themes=${themeNames.join(",")})`
  );
}

main().catch((error) => {
  console.error("[build-theme-storybook] failed:", error.message);
  process.exit(1);
});
