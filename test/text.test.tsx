import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "../src/components/Text";

describe("Text", () => {
  it("renders the default tag and typography classes for a variant", () => {
    render(<Text variant="heading-h1">Title</Text>);

    const element = screen.getByText("Title");
    expect(element.tagName).toBe("H1");
    expect(element).toHaveClass("font-heading", "text-heading-h1");
  });

  it("supports overriding the rendered tag via `as`", () => {
    render(
      <Text variant="heading-h1" as="span">
        Title
      </Text>
    );

    expect(screen.getByText("Title").tagName).toBe("SPAN");
  });

  it("applies uppercase and forwards extra className/props", () => {
    render(
      <Text variant="button-md" uppercase className="text-foreground" data-testid="cta">
        Book now
      </Text>
    );

    const element = screen.getByTestId("cta");
    expect(element).toHaveClass("font-button", "text-button-md", "uppercase", "text-foreground");
  });
});
