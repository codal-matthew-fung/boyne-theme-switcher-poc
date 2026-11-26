/// <reference types="vite/client" />
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import themeCss from "@/styles/generated/theme.css?raw";
import { ColorGrid, type ColorGroup, type ColorSwatchItem } from "./ColorGrid";

/**
 * Reads the custom brand colour tokens from the generated theme.
 * Only `--boyne-color-*` tokens are included, so Tailwind's default palette is excluded.
 */
const buildGroups = (css: string): ColorGroup[] => {
  const hexByVar = new Map<string, string>();
  for (const m of css.matchAll(/--boyne-color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6,8})\s*;/g)) {
    hexByVar.set(m[1], m[2]);
  }

  const swatches: { name: string; item: ColorSwatchItem }[] = [];
  for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*var\(--boyne-color-([a-z0-9-]+)\)/g)) {
    const [, name, varName] = m;
    if (name !== varName) continue;
    const hex = hexByVar.get(varName);
    if (!hex) continue;
    swatches.push({ name, item: { className: `bg-${name}`, hex } });
  }

  const groupTitle = (name: string) => {
    const ramp = name.match(/^(ramp|scrim)-(.+)-\d+$/);
    if (ramp) return `${ramp[1]}: ${ramp[2]}`;
    return name.split("-")[0];
  };

  const groups = new Map<string, ColorSwatchItem[]>();
  for (const { name, item } of swatches) {
    const title = groupTitle(name);
    groups.set(title, [...(groups.get(title) ?? []), item]);
  }

  return Array.from(groups, ([title, items]) => ({ title, swatches: items }));
};

const meta = {
  title: "Foundations/Color Grid",
  component: ColorGrid,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ColorGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {
  args: {
    groups: buildGroups(themeCss),
  },
};
