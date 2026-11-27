import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

export type ButtonVariant = "solid" | "outline";
export type ButtonColor = "primary" | "secondary" | "neutral" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonOwnProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  inverse?: boolean;
  size?: ButtonSize;
  isLoading?: boolean;
};

export type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonOwnProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonOwnProps | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

type Tone = "Default" | "Inverse";

const SolidMap: Record<ButtonColor, Record<Tone, string>> = {
  primary: {
    Default: "bg-button-primary text-default-surface-main hover:opacity-90",
    Inverse: "bg-button-inverse-primary text-button-neutral hover:opacity-90",
  },
  secondary: {
    Default: "bg-button-secondary text-button-neutral hover:opacity-90",
    Inverse: "bg-button-inverse-secondary text-button-neutral hover:opacity-90",
  },
  neutral: {
    Default: "bg-button-neutral text-default-surface-main hover:opacity-90",
    Inverse: "bg-button-inverse-neutral text-button-neutral hover:opacity-90",
  },
  destructive: {
    Default: "bg-button-destructive text-default-surface-main hover:opacity-90",
    Inverse: "bg-button-inverse-destructive text-button-neutral hover:opacity-90",
  },
};

const OutlineMap: Record<ButtonColor, Record<Tone, string>> = {
  primary: {
    Default: "border-button-primary text-button-primary hover:bg-default-surface-subtle",
    Inverse: "border-button-inverse-primary text-inverse-primary hover:bg-inverse-surface-subtle",
  },
  secondary: {
    Default: "border-button-secondary text-button-secondary hover:bg-default-surface-subtle",
    Inverse: "border-button-inverse-secondary text-inverse-primary hover:bg-inverse-surface-subtle",
  },
  neutral: {
    Default: "border-button-neutral text-button-neutral hover:bg-default-surface-subtle",
    Inverse: "border-button-inverse-neutral text-inverse-primary hover:bg-inverse-surface-subtle",
  },
  destructive: {
    Default: "border-button-destructive text-button-destructive hover:bg-default-surface-subtle",
    Inverse: "border-button-inverse-destructive text-inverse-primary hover:bg-inverse-surface-subtle",
  },
};

const DisabledMap: Record<Tone, string> = {
  Default:
    "disabled:bg-button-disabled disabled:text-default-surface-main aria-disabled:bg-button-disabled aria-disabled:text-default-surface-main",
  Inverse:
    "disabled:bg-button-inverse-disabled disabled:text-inverse-subtle aria-disabled:bg-button-inverse-disabled aria-disabled:text-inverse-subtle",
};

const SizeMap: Record<ButtonSize, string> = {
  sm: "h-component-2xl px-component-md text-button-sm",
  md: "h-component-3xl px-component-lg text-button-md",
  lg: "h-component-4xl px-component-xl text-button-lg",
};

export function Button(props: ButtonProps) {
  const {
    variant = "solid",
    color = "primary",
    inverse = false,
    size = "md",
    isLoading = false,
    ...rest
  } = props;

  const tone: Tone = inverse ? "Inverse" : "Default";

  const baseStyles =
    "inline-flex items-center justify-center rounded-button font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none aria-disabled:pointer-events-none";

  const variantStyles =
    variant === "outline"
      ? `border ${OutlineMap[color][tone]}`
      : `${SolidMap[color][tone]} ${DisabledMap[tone]}`;

  const className = `${baseStyles} ${variantStyles} ${SizeMap[size]}`;

  if (props.href !== undefined) {
    const { href, children, onClick, target, rel, className: extraClass, ...linkProps } = rest as Omit<ButtonAsLink, keyof ButtonOwnProps>;
    const isDisabled = isLoading;
    const safeRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel;

    return (
      <Link
        {...linkProps}
        href={href}
        target={target}
        rel={safeRel}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : linkProps.tabIndex}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        className={`${className} ${extraClass ?? ""}`.trim()}
      >
        {isLoading ? "Loading..." : children}
      </Link>
    );
  }

  const { children, disabled, type = "button", className: extraClass, ...buttonProps } = rest as Omit<ButtonAsButton, keyof ButtonOwnProps>;

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={Boolean(disabled) || isLoading}
      className={`${className} ${extraClass ?? ""}`.trim()}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
