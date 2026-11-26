// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    // Boyne Code and Component Conventions:
    // https://gocodal.atlassian.net/wiki/spaces/BR/pages/5635309617/Code+and+Component+Conventions
    rules: {
      // Naming: PascalCase components, camelCase functions/variables.
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
      ],

      // Props and composition: no `any`, strict typing.
      "@typescript-eslint/no-explicit-any": "error",

      // Component structure: function components only, one per file.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ClassDeclaration[superClass.property.name=/^(Component|PureComponent)$/], ClassDeclaration[superClass.name=/^(Component|PureComponent)$/]",
          message:
            "Use function components only — class components are not allowed (see Code and Component Conventions).",
        },
      ],
      "react/no-multi-comp": ["error", { ignoreStateless: false }],

      // Hooks and state: always list effect dependencies.
      "react-hooks/exhaustive-deps": "error",

      // Performance and accessibility.
      "react/no-array-index-key": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/no-noninteractive-element-interactions": "error",
    },
  },
]);

export default eslintConfig;
