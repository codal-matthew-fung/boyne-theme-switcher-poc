import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const TOKENS_ROOT = path.resolve(import.meta.dirname, "..", "..", "tokens");

export const DEFAULT_BRAND = "boyne-mountain";
export const DEFAULT_THEME = "default";

async function readTokenFile(kind, name) {
  const filePath = path.join(TOKENS_ROOT, kind, `${name}.json`);
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(
        `No ${kind.slice(0, -1)} token file found for "${name}" (expected ${filePath}).`
      );
    }
    throw error;
  }
}

async function listTokenNames(kind) {
  const dir = path.join(TOKENS_ROOT, kind);
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.replace(/\.json$/, ""))
    .sort();
}

export function readBrandTokens(brand) {
  return readTokenFile("brands", brand);
}

export function readThemeTokens(theme) {
  return readTokenFile("themes", theme);
}

export function listBrandNames() {
  return listTokenNames("brands");
}

export function listThemeNames() {
  return listTokenNames("themes");
}
