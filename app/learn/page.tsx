import { DATA } from "@/data/portfolio";
import Learn from "@/components/Learn";

export default function LearnPage() {
  return <Learn learn={DATA.learn} kanji={DATA.kanji} />;
}
