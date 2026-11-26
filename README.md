# Boyne Theme Switcher POC

Next.js (App Router, TypeScript, Tailwind v4) proof of concept for a brand/theme
switching system driven by JSON design tokens.

## Concept

Two independent environment variables select two independent token sets, which are
merged into one generated CSS file:

- `NEXT_BOYNE_BRAND` → `tokens/brands/<brand>.json` — colors and typography.
- `NEXT_BOYNE_THEME` → `tokens/themes/<theme>.json` — spacing and border radii.

`scripts/build-theme.mjs` reads both JSON files and writes
`src/styles/generated/theme.css` (gitignored, regenerated on demand), which defines
raw `--boyne-*` CSS variables plus a Tailwind v4 `@theme inline` block that maps them
onto standard Tailwind namespaces (`--color-*`, `--font-*`, `--spacing-*`,
`--radius-*`). That means brand/theme tokens become ordinary Tailwind utilities, e.g.
`bg-primary`, `font-heading`, `rounded-sm`.

The generation step runs:
- **ahead of time** before `next build` / `storybook build` (via `prebuild` /
  `prebuild-storybook` npm lifecycle hooks), and
- **at dev-server startup** before `next dev` / `storybook dev` (via `predev` /
  `prestorybook`).

No tokens exist yet beyond two placeholder brands (`boyne-mountain`, `big-sky`) and
two placeholder themes (`default`, `compact`) used to prove the pipeline works.

## Scripts

```bash
npm run dev               # regenerate theme CSS, then start Next.js dev server
npm run build             # regenerate theme CSS, then build for production
npm run build-theme       # regenerate theme CSS only
npm run test              # run unit tests (Vitest)
npm run test:watch        # run unit tests in watch mode
npm run storybook         # regenerate theme CSS, then start Storybook
npm run build-storybook   # regenerate theme CSS, then build static Storybook
```

Select a brand/theme via env vars, e.g.:

```bash
NEXT_BOYNE_BRAND=big-sky NEXT_BOYNE_THEME=compact npm run dev
```

If unset, both default to `boyne-mountain` / `default` with a console warning.

## Structure

```
tokens/
  brands/<brand>.json     # colors + typography tokens
  themes/<theme>.json     # spacing + radii tokens
scripts/
  build-theme.mjs         # CLI entry: resolves env vars, writes generated CSS
  lib/
    load-tokens.mjs        # reads/parses token JSON
    generate-theme-css.mjs # pure function: tokens -> CSS string (unit tested)
src/
  styles/generated/theme.css  # generated output (gitignored)
  components/[Component].tsx + .stories.tsx
  app/
```

## Status

This is a skeleton: the app, build pipeline, test setup, and Storybook are wired up
and verified end-to-end against placeholder tokens. Real brand/theme token values are
still to come — dropping real JSON into `tokens/brands/` and `tokens/themes/` is the
only change needed once they're available.
