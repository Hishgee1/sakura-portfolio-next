import { DATA } from "@/data/portfolio";
import Hero from "@/components/Hero";
import IntroSplash from "@/components/IntroSplash";

export default function Home() {
  return (
    <>
      <IntroSplash />
      <Hero
        name={DATA.name}
        role={DATA.role}
        tagline={DATA.tagline}
        available={DATA.available}
      />
    </>
  );
}
