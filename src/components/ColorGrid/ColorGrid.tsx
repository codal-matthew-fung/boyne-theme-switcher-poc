import { Text } from "@/components/Text";

export type ColorSwatchItem = {
  /** Tailwind utility class that paints the swatch, e.g. `bg-core-endeavor` */
  className: string;
  /** Resolved hex value, e.g. `#2d598e` */
  hex: string;
};

export type ColorGroup = {
  title: string;
  swatches: ColorSwatchItem[];
};

export type ColorGridProps = {
  groups: ColorGroup[];
  className?: string;
};
/**
 * Reads the custom brand colour tokens from the generated theme.
 * Only `--boyne-color-*` tokens are included, so Tailwind's default palette is excluded.
 */
export const buildGroups = (css: string): ColorGroup[] => {
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
export const ColorGrid = ({ groups, className }: ColorGridProps) => {
  return (
    <div>
      <Text variant="heading-h1" className="mb-component-lg">Color Grid</Text>
      <Text variant="body-lg" className="mb-component-2xl">To reduce class name lengths, dropped the additional categories from Figma keys, because tailwind uses prefix names, like bg-primary. To avoid duplication, dropped their categories. So we have bg-primary instead of bg-background-primary.</Text>
      <div className={`flex w-full flex-col gap-10 ${className ?? ""}`}>
      {groups.map((group) => (
        <section key={group.title} className="flex w-full flex-col gap-4">
          <Text variant="heading-h5" as="h3">
            {group.title}
          </Text>
          <div className="grid w-full grid-cols-[repeat(auto-fit,94px)] justify-start gap-4">
            {group.swatches.map((swatch) => (
              <figure key={swatch.className} className="flex w-24 flex-col gap-2 m-0">
                <div
                  className={`size-24 shrink-0 rounded border border-border-subtle ${swatch.className}`}
                  aria-hidden="true"
                />
                <figcaption className="flex flex-col gap-0.5">
                  <Text variant="body-xs" as="span" className="break-all">
                    {swatch.className}
                  </Text>
                  <Text variant="body-xs" as="span" className="break-all">
                    {swatch.hex}
                  </Text>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
      </div>
    </div>
  );
};
