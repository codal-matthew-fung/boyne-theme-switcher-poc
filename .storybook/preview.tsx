import type { Preview } from '@storybook/nextjs-vite'
import './storybook.css'

// Keep in sync with tokens/brands/*.json and tokens/themes/*.json — this list
// only drives the toolbar UI; generated/theme.storybook.css (built by
// `npm run build-theme-storybook`, see scripts/build-theme-storybook.mjs) is
// generated from the token files directly, so a brand/theme added there
// still needs an entry added here to appear in the toolbar.
const BRANDS = ['boyne-mountain', 'boyne-resorts', 'big-sky', 'gatlinburg'] as const;
const THEMES = ['default', 'compact'] as const;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  initialGlobals: {
    brand: BRANDS[0],
    theme: THEMES[0],
  },

  globalTypes: {
    brand: {
      name: 'Brand',
      description: 'Boyne brand token set',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: BRANDS.map((brand) => ({ value: brand, title: brand })),
      },
    },
    theme: {
      name: 'Theme',
      description: 'Spacing/radii/type-scale token set',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        dynamicTitle: true,
        items: THEMES.map((theme) => ({ value: theme, title: theme })),
      },
    },
  },

  decorators: [
    (story, context) => {
      const { brand, theme } = context.globals;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-brand', brand ?? BRANDS[0]);
        document.documentElement.setAttribute('data-theme', theme ?? THEMES[0]);
      }
      return story();
    },
  ],
};

export default preview;
