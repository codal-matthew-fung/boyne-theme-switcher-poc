import { describe, expect, it } from "vitest";
import { generateThemeCss } from "../scripts/lib/generate-theme-css.mjs";

describe("generateThemeCss", () => {
  const brandTokens = {
    colors: {
      primary: "#0B5394",
      background: "#FFFFFF",
    },
    typography: {
      fontHeading: "'Poppins', sans-serif",
      fontBody: "'Inter', sans-serif",
    },
  };

  const themeTokens = {
    spacing: {
      sm: "0.5rem",
    },
    radii: {
      sm: "0.25rem",
    },
  };

  it("writes brand colors and typography into both the raw and @theme blocks", () => {
    const css = generateThemeCss({
      brand: "boyne-mountain",
      theme: "default",
      brandTokens,
      themeTokens,
    });

    expect(css).toContain("--boyne-color-primary: #0B5394;");
    expect(css).toContain("--color-primary: var(--boyne-color-primary);");
    expect(css).toContain("--boyne-font-heading: 'Poppins', sans-serif;");
    expect(css).toContain("--font-heading: var(--boyne-font-heading);");
  });

  it("writes theme spacing and radii tokens", () => {
    const css = generateThemeCss({
      brand: "boyne-mountain",
      theme: "default",
      brandTokens,
      themeTokens,
    });

    expect(css).toContain("--boyne-spacing-sm: 0.5rem;");
    expect(css).toContain("--spacing-sm: var(--boyne-spacing-sm);");
    expect(css).toContain("--boyne-radius-sm: 0.25rem;");
    expect(css).toContain("--radius-sm: var(--boyne-radius-sm);");
  });

  it("records which brand and theme produced the file", () => {
    const css = generateThemeCss({
      brand: "big-sky",
      theme: "compact",
      brandTokens,
      themeTokens,
    });

    expect(css).toContain("brand: big-sky");
    expect(css).toContain("theme: compact");
  });
});
