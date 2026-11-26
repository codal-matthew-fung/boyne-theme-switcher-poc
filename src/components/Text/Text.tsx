import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// className is written out as a literal per variant (not `font-${role} text-${variant}`)
// because Tailwind's scanner only generates utilities for class names it finds as
// literal strings in source — a runtime-interpolated string is invisible to it.
const VARIANT_CONFIG = {
  "display-lg": { role: "display", tag: "h1", className: "font-display text-display-lg" },
  "heading-h1": { role: "heading", tag: "h1", className: "font-heading text-heading-h1" },
  "heading-h2": { role: "heading", tag: "h2", className: "font-heading text-heading-h2" },
  "heading-h3": { role: "heading", tag: "h3", className: "font-heading text-heading-h3" },
  "heading-h4": { role: "heading", tag: "h4", className: "font-heading text-heading-h4" },
  "heading-h5": { role: "heading", tag: "h5", className: "font-heading text-heading-h5" },
  "heading-h6": { role: "heading", tag: "h6", className: "font-heading text-heading-h6" },
  "subheading-lg": { role: "subheading", tag: "p", className: "font-subheading text-subheading-lg" },
  "subheading-md": { role: "subheading", tag: "p", className: "font-subheading text-subheading-md" },
  "subheading-sm": { role: "subheading", tag: "p", className: "font-subheading text-subheading-sm" },
  "body-lg": { role: "body", tag: "p", className: "font-body text-body-lg" },
  "body-md": { role: "body", tag: "p", className: "font-body text-body-md" },
  "body-sm": { role: "body", tag: "p", className: "font-body text-body-sm" },
  "body-xs": { role: "body", tag: "p", className: "font-body text-body-xs" },
  "link-lg": { role: "link", tag: "a", className: "font-link text-link-lg" },
  "link-md": { role: "link", tag: "a", className: "font-link text-link-md" },
  "link-sm": { role: "link", tag: "a", className: "font-link text-link-sm" },
  "link-xs": { role: "link", tag: "a", className: "font-link text-link-xs" },
  "caption-sm": { role: "caption", tag: "span", className: "font-caption text-caption-sm" },
  "button-lg": { role: "button", tag: "span", className: "font-button text-button-lg" },
  "button-md": { role: "button", tag: "span", className: "font-button text-button-md" },
  "button-sm": { role: "button", tag: "span", className: "font-button text-button-sm" },
  "button-xs": { role: "button", tag: "span", className: "font-button text-button-xs" },
  "navigation-md": { role: "navigation", tag: "span", className: "font-navigation text-navigation-md" },
  "navigation-sm": { role: "navigation", tag: "span", className: "font-navigation text-navigation-sm" },
  "badge-lg": { role: "badge", tag: "span", className: "font-badge text-badge-lg" },
  "badge-md": { role: "badge", tag: "span", className: "font-badge text-badge-md" },
  "badge-sm": { role: "badge", tag: "span", className: "font-badge text-badge-sm" },
  "badge-xs": { role: "badge", tag: "span", className: "font-badge text-badge-xs" },
  "eyebrow-lg": { role: "eyebrow", tag: "p", className: "font-eyebrow text-eyebrow-lg" },
  "eyebrow-md": { role: "eyebrow", tag: "p", className: "font-eyebrow text-eyebrow-md" },
  "form-label-sm": { role: "form-label", tag: "label", className: "font-form-label text-form-label-sm" },
} as const satisfies Record<string, { role: string; tag: ElementType; className: string }>;

export type TextVariant = keyof typeof VARIANT_CONFIG;

type TextOwnProps<T extends ElementType> = {
  variant: TextVariant;
  as?: T;
  uppercase?: boolean;
  className?: string;
  children: ReactNode;
};

export type TextProps<T extends ElementType = ElementType> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

export function Text<T extends ElementType = ElementType>({
  variant,
  as,
  uppercase,
  className,
  children,
  ...rest
}: TextProps<T>) {
  const { tag, className: variantClassName } = VARIANT_CONFIG[variant];
  const Tag = as ?? tag;

  const classes = [variantClassName, uppercase && "uppercase", className].filter(Boolean).join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
