import { DATA } from "@/data/portfolio";
import About from "@/components/About";

export default function AboutPage() {
  return <About about={DATA.about} skills={DATA.skills} name={DATA.name} tagline={DATA.tagline} />;
}
