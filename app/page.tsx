import { DATA } from "@/data/portfolio";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <Hero
      name={DATA.name}
      role={DATA.role}
      tagline={DATA.tagline}
      available={DATA.available}
    />
  );
}
