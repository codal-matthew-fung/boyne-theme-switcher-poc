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
