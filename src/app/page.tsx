import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
const brand = process.env.NEXT_BOYNE_BRAND;
const theme = process.env.NEXT_BOYNE_THEME;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-start gap-2">
        <Text variant="heading-h1">Boyne Theming POC</Text>
        <Text variant="body-md">The purpose of this repo is to demonstrate an example setup we could utilise to theme the components.</Text>
        <Text variant="body-md">Brand: {brand}</Text>
        <Text variant="body-md">Theme: {theme}</Text>
        <div className="grid grid-cols-2 gap-component-lg">
          <Card
            cardHeading="Family Adventure Bundle"
            cardSubcopy="The SkyPark Family Bundle - full adult admission plus 20% off junior tickets."
            ticketTier="Adult"
            price={48}
            buttonText="View Details"
            buttonTextSecondary="Buy Now"
          />
          <Card
            cardHeading="Family Adventure Bundle"
            cardSubcopy="The SkyPark Family Bundle - full adult admission plus 20% off junior tickets."
            ticketTier="Adult"
            price={48}
            buttonText="View Details"
            buttonTextSecondary="Buy Now"
            inverse
          />
        </div>
      </div>
    </div>
  );
}
