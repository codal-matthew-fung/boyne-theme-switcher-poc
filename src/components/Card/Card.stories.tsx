import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/components/Card/Card";

const meta = {
  title: "Components/Card",
  component: Card,
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
  },
  "decorators": [
    (story) => {
      const Story = story;
      return (
      <ul className="grid grid-cols-4">
        <li>
          <Story/>
        </li>
      </ul>)
    }
  ]
}
