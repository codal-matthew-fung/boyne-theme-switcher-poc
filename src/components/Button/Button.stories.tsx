import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button, type ButtonAsButton } from "@/components/Button/Button";

const COLORS = ["primary", "secondary", "neutral", "destructive"] as const;

const Stage = (props: ButtonAsButton) => {
  return (
    <div className="grid grid-cols-2 gap-component-lg">
      <div className="bg-default-surface-subtle p-margin-lg flex flex-col gap-component-md items-start">
        {COLORS.map((color) => (
          <Button key={color} {...props} color={color}>
            {color} {props.variant ?? "solid"}
          </Button>
        ))}
        <Button {...props} disabled>Disabled</Button>
      </div>
      <div className="bg-inverse-surface-subtle p-margin-lg flex flex-col gap-component-md items-start">
        {COLORS.map((color) => (
          <Button key={color} {...props} color={color} inverse>
            {color} {props.variant ?? "solid"}
          </Button>
        ))}
        <Button {...props} inverse disabled>Disabled</Button>
      </div>
    </div>
  );
};

const meta = {
  title: "Components/Button",
  component: Stage,
  argTypes: {
    variant: { control: "select", options: ["solid", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isLoading: { control: "boolean" },
  },
} satisfies Meta<typeof Stage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: { variant: "solid", size: "md" },
};

export const Outline: Story = {
  args: { variant: "outline", size: "md" },
};

// Same styles, rendered as a Next.js link when href is set.
export const AsLink: Story = {
  render: (args) => (
    <div className="flex flex-col gap-component-md items-start bg-default-surface-subtle p-margin-lg">
      <Button href="https://example.com" target="_blank" variant={args.variant} size={args.size}>
        Visit site (new tab)
      </Button>
      <Button href="/tickets" variant={args.variant} size={args.size}>
        Internal link
      </Button>
      <Button href="/tickets" variant={args.variant} size={args.size} isLoading>
        Loading link
      </Button>
    </div>
  ),
  args: { variant: "solid", size: "md" },
};
