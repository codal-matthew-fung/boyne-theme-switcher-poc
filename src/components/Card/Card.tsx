import { ComponentPropsWithoutRef, ElementType } from "react"
import { Text } from "@/components/Text";
import { Divider } from "@/components/Divider/Divider";
import { Button } from "@/components/Button/Button";

type CardOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  cardHeading: string;
  cardSubcopy: string;
  ticketTier: string;
  price: number;
  inverse?: boolean;
  buttonText: string;
  buttonTextSecondary?: string;
};

export type CardProps<T extends ElementType = ElementType> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

export const Card = (cardProps: CardProps) => {
  const { cardHeading, cardSubcopy, ticketTier, price, inverse, as, buttonText, buttonTextSecondary } = cardProps;
  const Tag = as ?? "div";
  const Container = as == "span" ? "span" : "div";
  const isInverse = inverse;
  const cardColor = isInverse ? 'bg-inverse-surface-raised border-inverse-subtle/40' : 'bg-default-surface-raised border-border-subtle/40';
  const textColor = isInverse ? 'text-inverse-primary' : 'text-button-neutral';
  const hasPrimary = Boolean(buttonText?.trim());
  const hasSecondary = Boolean(buttonTextSecondary?.trim());
  return (
    <Tag className={`${cardColor} border grid grid-rows-2 grid-cols-1 max-w-80`}>
      <Container className="relative">
        {/* Badge Here */}
        {/* Image Here */}
      </Container>
      <Container className="p-component-lg flex justify-start items-start flex-col gap-component-lg">
        <Container className="flex flex-col gap-2">
          <Text variant="heading-h5" as="h3" className={textColor}>{cardHeading}</Text>
          <Text variant="body-md" as="p" className={textColor}>{cardSubcopy}</Text>
        </Container>
        <Divider type="Subtle" color={isInverse ? "Inverse" : "Default"} />
        <Container className="flex flex-col gap-2">
          <Text variant="body-sm" as="p" className={textColor}>{ticketTier}</Text>
          <Text variant="heading-h6" as="p" className={textColor}>From ${price}</Text>
        </Container>
        <Container className="flex justify-center items-start gap-2.5">
          {hasSecondary && (
            <Button variant="outline" color="primary" inverse={isInverse} size="lg">{buttonTextSecondary}</Button>
          )}
          {hasPrimary && (
            <Button variant="solid" color="primary" inverse={isInverse} size="lg">{buttonText}</Button>
          )}
        </Container>
      </Container>
    </Tag>
  )
}
