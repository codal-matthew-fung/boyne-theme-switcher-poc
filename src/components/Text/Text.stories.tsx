import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text, type TextVariant } from "./Text";

const VARIANTS: TextVariant[] = [
  "display-lg",
  "heading-h1",
  "heading-h2",
  "heading-h3",
  "heading-h4",
  "heading-h5",
  "heading-h6",
  "subheading-lg",
  "subheading-md",
  "subheading-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "body-xs",
  "link-lg",
  "link-md",
  "link-sm",
  "link-xs",
  "caption-sm",
  "button-lg",
  "button-md",
  "button-sm",
  "button-xs",
  "navigation-md",
  "navigation-sm",
  "badge-lg",
  "badge-md",
  "badge-sm",
  "badge-xs",
  "eyebrow-lg",
  "eyebrow-md",
  "form-label-sm",
];

const VARIANT_GROUPS: { label: string; variants: TextVariant[] }[] = [
  { label: "Display", variants: ["display-lg"] },
  {
    label: "Headings",
    variants: [
      "heading-h1",
      "heading-h2",
      "heading-h3",
      "heading-h4",
      "heading-h5",
      "heading-h6",
    ],
  },
  {
    label: "Subheadings",
    variants: ["subheading-lg", "subheading-md", "subheading-sm"],
  },
  { label: "Body", variants: ["body-lg", "body-md", "body-sm", "body-xs"] },
  { label: "Links", variants: ["link-lg", "link-md", "link-sm", "link-xs"] },
  { label: "Caption", variants: ["caption-sm"] },
  {
    label: "Buttons",
    variants: ["button-lg", "button-md", "button-sm", "button-xs"],
  },
  { label: "Navigation", variants: ["navigation-md", "navigation-sm"] },
  { label: "Badges", variants: ["badge-lg", "badge-md", "badge-sm", "badge-xs"] },
  { label: "Eyebrow", variants: ["eyebrow-lg", "eyebrow-md"] },
  { label: "Form Label", variants: ["form-label-sm"] },
];

const meta = {
  title: "Typography/Text",
  component: Text,
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "heading-h1",
    children: "The quick brown fox",
  },
};

export const Uppercase: Story = {
  args: {
    variant: "heading-h2",
    uppercase: true,
    children: "The quick brown fox",
  },
};

export const AllVariants: Story = {
  args: {
    variant: "body-md",
    children: "",
  },
  render: () => (
    <div className="flex flex-col">
      {VARIANT_GROUPS.map((group) => (
        <div key={group.label} className="mb-margin-lg">
          <Text variant="heading-h4" className="mb-component-lg text-primary">
            {group.label}
          </Text>
          <div className="flex flex-col gap-sm">
            {group.variants.map((variant) => (
              <Text key={variant} variant={variant} className="text-primary">
                {variant}: The quick brown fox jumps over the lazy dog
              </Text>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
