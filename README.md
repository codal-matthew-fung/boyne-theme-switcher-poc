# Boyne Theme Switcher POC

A proof of concept for switching the look of the site between brands and themes.
The colors, fonts, spacing and corner shapes all come from simple JSON files, so
changing a brand is a data change, not a code change.

Built with Next.js (App Router, TypeScript, Tailwind CSS v4).

## How it works

Think of the look of the site as two layers that you can mix and match:

- **Brand** controls colors and typography (fonts and text sizes).
  These live in `tokens/brands/`.
- **Theme** controls spacing and corner shapes (how roomy and rounded things feel).
  These live in `tokens/themes/`.

Each brand and theme is one JSON file. The build reads one brand and one theme,
then writes a single stylesheet that the site uses. Tailwind then turns those
values into ordinary class names, so a developer can write things like `bg-primary`,
`font-heading` or `rounded-sm` and the right value for the active brand and theme
is applied.

### Choosing a brand and theme for the app

Two environment variables pick the brand and theme for the Next.js app:

- `NEXT_BOYNE_BRAND`, for example `boyne-resorts`
- `NEXT_BOYNE_THEME`, for example `compact`

Copy `.env.example` to `.env` to set your own values. If either variable is missing,
the build falls back to `boyne-mountain` and `default` and prints a warning in the
terminal.

### Generated stylesheets

Generated files are never edited by hand. They are rebuilt automatically:

- **Next.js app:** `src/styles/generated/theme.css`, built from the brand and theme
  you selected. It is rebuilt before `npm run dev` and `npm run build`.
- **Storybook:** `src/styles/generated/theme.storybook.css`, built from every brand
  and every theme at once. It is rebuilt before `npm run storybook` and
  `npm run build-storybook`.

Both generated files are ignored by Git, so they are always created fresh on
your machine.

## Using Storybook to preview brands and themes

Storybook lets you see any component in any brand and theme without restarting
anything.

1. Run `npm run storybook`.
2. Use the **Brand** and **Theme** dropdowns in the Storybook toolbar.
3. The page updates immediately, so you can compare brands side by side in your
   browser.

This works because the Storybook stylesheet includes every brand and theme, and the
toolbar switches between them by changing an attribute on the page. The Next.js app
does not use this and is not affected.

When you add a new brand or theme JSON file, it is picked up automatically the next
time Storybook builds. You also need to add its name to the lists at the top of
`.storybook/preview.tsx` so it shows up in the toolbar.

## Getting started

Install the dependencies, then start the app or Storybook:

```bash
npm install
npm run dev          # the Next.js app
npm run storybook    # the component library in Storybook
```

## Scripts

```bash
npm run dev               # build the app theme, then start the Next.js dev server
npm run build             # build the app theme, then create a production build
npm run start             # run the production build
npm run build-theme       # rebuild only the app theme stylesheet
npm run storybook         # build the Storybook theme, then start Storybook
npm run build-storybook   # build the Storybook theme, then create a static Storybook
npm run build-theme-storybook  # rebuild only the Storybook theme stylesheet
npm run test              # run the unit tests once
npm run test:watch        # run the unit tests and re-run them when files change
npm run lint              # check the code for problems
```

Example of choosing a brand and theme for a single run:

```bash
NEXT_BOYNE_BRAND=big-sky NEXT_BOYNE_THEME=compact npm run dev
```

## Folder guide

```
tokens/
  brands/<brand>.json        # colors and typography for each brand
  themes/<theme>.json        # spacing and corner shapes for each theme
  raw-figma-export.json      # the original design export, kept for reference
scripts/
  build-theme.mjs            # builds the app stylesheet from the chosen brand and theme
  build-theme-storybook.mjs  # builds the Storybook stylesheet from all brands and themes
  lib/                       # shared helpers that read tokens and write the CSS
src/
  app/                       # the Next.js pages and global styles
  components/                # reusable UI pieces, each with its own Storybook stories
  styles/
    base.css                 # shared base styles for the app and Storybook
    generated/               # generated stylesheets (not stored in Git)
.storybook/                  # Storybook settings, including the brand and theme toolbar
test/                        # automated tests
```

## Current status

- The app, the build process, the tests and Storybook are all working.
- Boyne Resorts and Gatlinburg have real brand token files.
- `boyne-mountain` and `big-sky` are still placeholders.
- The two themes, `default` and `compact`, are working examples. Final values
  are still to come.

To bring in final values, update the JSON files in `tokens/brands/` and
`tokens/themes/`. No code changes are needed for that. If you add a new brand or
theme, also add its name to `.storybook/preview.tsx` so it appears in the toolbar.
