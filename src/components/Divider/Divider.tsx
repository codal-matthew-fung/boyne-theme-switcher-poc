export type DividerProps = {
  type?: "Default" | "Subtle";
  color?: "Default" | "Inverse";
};

type DividerType = NonNullable<DividerProps["type"]>;
type DividerColor = NonNullable<DividerProps["color"]>;

const ColorMap: Record<DividerType, Record<DividerColor, string>> = {
  "Default": {
    "Default": "border-border-default/80",
    "Inverse": "border-border-inverse-default/80"
  },
  "Subtle": {
    "Default": "border-border-subtle/40",
    "Inverse": "border-border-inverse-subtle/40"
  }
};

export const Divider = ({ type = "Default", color = "Default" }: DividerProps) => {
  return (<hr className={`w-full max-w-full block border ${ColorMap[type][color]}`} />);
}
