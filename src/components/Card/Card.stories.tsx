import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, type CardProps } from "@/components/Card/Card";
import { Text } from "../Text";

const Stage = (cardProps: CardProps) => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-default-surface-subtle p-margin-lg">
        <Text variant="heading-h2" className="mb-component-lg">Default</Text>
        <Card {...cardProps} />
      </div>
      <div className="bg-inverse-surface-subtle p-margin-lg">
        <Text variant="heading-h2" className="mb-component-lg text-inverse-primary">Inverse</Text>
        <Card {...cardProps} inverse={true} />
      </div>
    </div>
  )
}

const meta = {
  title: "Components/Card",
  component: Stage,
  argTypes: {
    cardHeading: {
      control: "text"
    },
    cardSubcopy: {
      control: "text"
    },
    ticketTier: {
      control: "select",
      options: ["Adult", "Child"]
    },
    price: {
      control: "number",
    }
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    cardHeading: "Family Adventure Bundle",
    cardSubcopy: "The SkyPark Family Bundle - full adult admission plus 20% off junior tickets.",
    ticketTier: "Adult",
    price: 48
  }
}
