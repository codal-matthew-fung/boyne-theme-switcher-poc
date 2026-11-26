import { Text } from "@/components/Text";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-start gap-2">
        <Text variant="heading-h1">Boyne Theming POC</Text>
        <Text variant="body-md">The purpose of this repo is to demonstrate an example setup we could utilise to theme the components.</Text>
      </div>
    </div>
  );
}
