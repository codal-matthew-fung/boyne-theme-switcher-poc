/// <reference types="vite/client" />
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import themeCss from "@/styles/generated/theme.css?raw";
import { ColorGrid, buildGroups } from "./ColorGrid";


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
