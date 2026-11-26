import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Divider } from "@/components/Divider/Divider";

const meta = {
  title: "Components/Divider",
  component: Divider,
  argTypes: {
    type: {
      control: "select",
      options: ["Default", "Subtle"]
    },
    color: {
      control: "select",
      options: ["Default", "Inverse"]
    }
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    type: "Default",
    color: "Default"
  }
};

export const DefaultInverse: Story = {
  args: {
    type: "Default",
    color: "Inverse"
  },
  decorators: (story) => {
    const Story = story;
    return (<div className="w-full h-full bg-inverse-surface-subtle p-component-2xl"><Story/></div>)
  }
}

export const SubtleDefault: Story = {
  args: {
    type: "Subtle",
    color: "Default"
  }
}

export const SubtleInverse: Story = {
  args: {
    type: "Subtle",
    color: "Inverse"
  },
  decorators: (story) => {
    const Story = story;
    return (<div className="w-full h-full bg-inverse-surface-subtle p-component-2xl"><Story/></div>)
  }
}
