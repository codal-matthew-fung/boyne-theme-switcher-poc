const PREFIX = "boyne";

// Maps a token JSON section to the Tailwind v4 `@theme` namespace it feeds.
// Add an entry here when a new category of token (e.g. shadows, z-index) is introduced.
const SECTION_TO_NAMESPACE = {
  colors: "color",
  typography: "font",
  fontWeight: "font-weight",
  spacing: "spacing",
  radii: "radius",
  typeScale: "text",
};

// Tailwind v4 only generates a utility for a class name it finds literally in
// scanned source. A component that builds a class from a variable (e.g.
// `` `bg-${color}` ``) never produces a literal string Tailwind can see, so the
// utility silently never exists. Rather than rely on every call site writing
// literal classes (easy to forget), we safelist every utility these tokens can
// produce via `@source inline(...)`, so every token-derived class name works
// whether a developer writes it literally or builds it dynamically.
const UTILITY_PREFIXES_BY_NAMESPACE = {
  color: ["bg", "text", "border", "ring", "outline", "divide", "decoration", "accent", "caret", "fill", "stroke"],
  radius: ["rounded"],
  spacing: ["p", "px", "py", "pt", "pr", "pb", "pl", "m", "mx", "my", "mt", "mr", "mb", "ml", "gap", "gap-x", "gap-y", "space-x", "space-y", "w", "h"],
  font: ["font"],
  "font-weight": ["font"],
  text: ["text"],
};

function toKebabCase(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function stripFontPrefix(key) {
  // typography tokens are named fontHeading/fontBody; the "font" namespace
  // already supplies the prefix, so avoid "--font-font-heading".
  return key.replace(/^font-?/i, "");
}

// typeScale entries are role -> size -> { fontSize, lineHeight, letterSpacing }.
// Each leaf expands into a Tailwind v4 compound `--text-{role}-{size}` variable
// plus its `--line-height`/`--letter-spacing`/`--font-weight` companions, so a
// single `text-{role}-{size}` utility applies the whole type style at once.
// The font-weight companion points at the brand's `--font-weight-{role}` token,
// so weight still follows the active brand.
function flattenTypeScale(tokens) {
  const entries = [];
  for (const [role, sizes] of Object.entries(tokens)) {
    for (const [size, { fontSize, lineHeight, letterSpacing }] of Object.entries(sizes)) {
      const key = `${role}-${size}`;
      entries.push({ namespace: "text", suffix: key, value: fontSize });
      entries.push({ namespace: "text", suffix: `${key}--line-height`, value: lineHeight });
      entries.push({ namespace: "text", suffix: `${key}--letter-spacing`, value: letterSpacing });
      entries.push({
        namespace: "text",
        suffix: `${key}--font-weight`,
        value: `var(--boyne-font-weight-${role})`,
      });
    }
  }
  return entries;
}

function flattenSection(section, tokens) {
  if (section === "typeScale") return flattenTypeScale(tokens);

  const namespace = SECTION_TO_NAMESPACE[section];
  if (!namespace) return [];

  return Object.entries(tokens).map(([key, value]) => {
    let suffix = toKebabCase(key);
    if (namespace === "font") suffix = stripFontPrefix(suffix) || suffix;
    return { namespace, suffix, value };
  });
}

function collectVariables(brandTokens, themeTokens) {
  const variables = [];
  for (const [section, tokens] of Object.entries(brandTokens)) {
    if (typeof tokens === "object" && tokens !== null) {
      variables.push(...flattenSection(section, tokens));
    }
  }
  for (const [section, tokens] of Object.entries(themeTokens)) {
    if (typeof tokens === "object" && tokens !== null) {
      variables.push(...flattenSection(section, tokens));
    }
  }
  return variables;
}

// Compound `text-{role}-{size}` tokens also carry companion variables
// (`--line-height`, `--letter-spacing`, `--font-weight`) that are only ever
// read via `var(...)`, never as a standalone utility; exclude those suffixes.
function isUtilitySuffix(suffix) {
  return !suffix.includes("--");
}

function buildSafelist(variables) {
  const classes = new Set();
  for (const { namespace, suffix } of variables) {
    if (!isUtilitySuffix(suffix)) continue;
    const prefixes = UTILITY_PREFIXES_BY_NAMESPACE[namespace];
    if (!prefixes) continue;
    for (const prefix of prefixes) classes.add(`${prefix}-${suffix}`);
  }
  return [...classes].sort();
}

function variableKey({ namespace, suffix }) {
  return `${namespace}::${suffix}`;
}

/**
 * Pure function: builds one Storybook-only stylesheet containing every
 * brand x theme combination, each scoped under a `[data-brand][data-theme]`
 * attribute selector instead of baked into `:root` at build time. This lets
 * Storybook switch brand/theme at runtime (a toolbar writing those
 * attributes onto `<html>`) with no rebuild, while the Next.js app keeps
 * using `generateThemeCss` with one brand/theme chosen via env vars.
 *
 * Every combination block declares the FULL union of variable names across
 * all brands/themes (not just the ones that brand/theme defines), falling
 * back to the first combo that defines a given variable when the active
 * brand/theme doesn't. Without this, switching from a fully-tokenized brand
 * (e.g. boyne-resorts) to a smaller placeholder brand (e.g. big-sky, which
 * only defines a handful of color keys) would leave the previous brand's
 * values for undefined keys still in effect (stale CSS custom properties
 * aren't reset by the cascade unless something overrides them).
 */
export function generateStorybookThemeCss({ brands, themes, defaultBrand, defaultTheme }) {
  const orderedBrands = [
    ...brands.filter((b) => b.name === defaultBrand),
    ...brands.filter((b) => b.name !== defaultBrand),
  ];
  const orderedThemes = [
    ...themes.filter((t) => t.name === defaultTheme),
    ...themes.filter((t) => t.name !== defaultTheme),
  ];

  // variables per combo, plus a fallback value for every variable key seen
  // anywhere, resolved in (default brand/theme first) order so the default
  // combo's own values win ties.
  const comboVariables = new Map(); // `${brand}::${theme}` -> variables[]
  const fallbackValues = new Map(); // variableKey -> value

  for (const { name: brand, tokens: brandTokens } of orderedBrands) {
    for (const { name: theme, tokens: themeTokens } of orderedThemes) {
      const variables = collectVariables(brandTokens, themeTokens);
      comboVariables.set(`${brand}::${theme}`, variables);
      for (const variable of variables) {
        const key = variableKey(variable);
        if (!fallbackValues.has(key)) fallbackValues.set(key, variable.value);
      }
    }
  }

  const unionVariables = [...fallbackValues.keys()].sort().map((key) => {
    const [namespace, suffix] = key.split("::");
    return { namespace, suffix };
  });

  const themeDeclarations = unionVariables
    .map(
      ({ namespace, suffix }) =>
        `  --${namespace}-${suffix}: var(--${PREFIX}-${namespace}-${suffix});`
    )
    .join("\n");

  const safelist = buildSafelist(unionVariables);

  const comboBlocks = orderedBrands
    .flatMap(({ name: brand }) =>
      orderedThemes.map(({ name: theme }) => {
        const own = new Map(
          comboVariables.get(`${brand}::${theme}`).map((v) => [variableKey(v), v.value])
        );
        const declarations = unionVariables
          .map(({ namespace, suffix }) => {
            const key = `${namespace}::${suffix}`;
            const value = own.get(key) ?? fallbackValues.get(key);
            return `  --${PREFIX}-${namespace}-${suffix}: ${value};`;
          })
          .join("\n");
        return `[data-brand="${brand}"][data-theme="${theme}"] {\n${declarations}\n}`;
      })
    )
    .join("\n\n");

  const defaultDeclarations = unionVariables
    .map(({ namespace, suffix }) => {
      const key = `${namespace}::${suffix}`;
      return `  --${PREFIX}-${namespace}-${suffix}: ${fallbackValues.get(key)};`;
    })
    .join("\n");

  return `/**
 * GENERATED FILE - do not edit by hand.
 * Produced by scripts/build-theme-storybook.mjs for Storybook ONLY.
 * The Next.js app does not use this file; it keeps using theme.css, built
 * from a single brand/theme chosen via NEXT_BOYNE_BRAND/NEXT_BOYNE_THEME.
 *
 * Contains every brand x theme combination (brands: ${orderedBrands.map((b) => b.name).join(", ")};
 * themes: ${orderedThemes.map((t) => t.name).join(", ")}), each scoped under a
 * [data-brand][data-theme] selector so Storybook's toolbar can switch
 * brand/theme at runtime by setting those attributes on <html>.
 */

:root {
${defaultDeclarations}
}

@theme inline {
${themeDeclarations}
}

${comboBlocks}

/**
 * Safelists every utility class any brand/theme's tokens can produce (union
 * across all combos), so a class name works regardless of which combo is
 * active — see generateThemeCss's equivalent comment for why this is needed.
 */
@source inline("${safelist.join(" ")}");
`;
}

/**
 * Pure function: merges brand + theme token objects into the generated CSS
 * module. Brand decides colors/typography; theme decides spacing/radii; both
 * are exposed to Tailwind v4 via an inline `@theme` block.
 */
export function generateThemeCss({ brand, theme, brandTokens, themeTokens }) {
  const variables = collectVariables(brandTokens, themeTokens);

  const rawDeclarations = variables
    .map(({ namespace, suffix, value }) => `  --${PREFIX}-${namespace}-${suffix}: ${value};`)
    .join("\n");

  const themeDeclarations = variables
    .map(
      ({ namespace, suffix }) =>
        `  --${namespace}-${suffix}: var(--${PREFIX}-${namespace}-${suffix});`
    )
    .join("\n");

  const safelist = buildSafelist(variables);

  return `/**
 * GENERATED FILE - do not edit by hand.
 * Produced by scripts/build-theme.mjs from:
 *   brand: ${brand} (tokens/brands/${brand}.json)
 *   theme: ${theme} (tokens/themes/${theme}.json)
 */

:root {
${rawDeclarations}
}

@theme inline {
${themeDeclarations}
}

/**
 * Safelists every utility class these tokens can produce, so a class name
 * works whether a component writes it literally or builds it at runtime
 * (e.g. \`\`bg-\${color}\`\`) — Tailwind's scanner only generates utilities it
 * finds as literal strings, so a dynamic class name would otherwise silently
 * produce no CSS.
 */
@source inline("${safelist.join(" ")}");
`;
}
