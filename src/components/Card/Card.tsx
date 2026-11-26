import { ComponentPropsWithoutRef, ElementType } from "react"
import { Text } from "@/components/Text";
import { Divider } from "@/components/Divider/Divider";

type CardOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  cardHeading: string;
  cardSubcopy: string;
  ticketTier: string;
  price: number;
};

export type CardProps<T extends ElementType = ElementType> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

export const Card = (cardProps: CardProps) => {
  const { cardHeading, cardSubcopy, ticketTier, price, as } = cardProps;
  const Tag = as ?? "div";
  const Container = as == "span" ? "span" : "div"

  return (
    <Tag className="border border-border-subtle grid grid-rows-2 grid-cols-1">
      <Container className="relative">
        {/* Badge Here */}
        {/* Image Here */}
      </Container>
      <Container className="p-component-lg flex justify-start items-start flex-col gap-component-lg">
        <Container className="flex flex-col gap-2">
          <Text variant="heading-h5" as="h3">{cardHeading}</Text>
          <Text variant="body-md" as="p">{cardSubcopy}</Text>
        </Container>
        <Divider type="Subtle" color="Default" />
        <Container className="flex flex-col gap-2">
          <Text variant="body-sm" as="p">{ticketTier}</Text>
          <Text variant="heading-h6" as="p">From ${price}</Text>
        </Container>
        <Container className="flex justify-center items-start gap-2.5">
          {/* Button */}
          {/* Button */}
        </Container>
      </Container>
    </Tag>
  )
}
