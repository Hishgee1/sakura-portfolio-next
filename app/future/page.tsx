import { DATA } from "@/data/portfolio";
import FutureGoals from "@/components/FutureGoals";

export default function FuturePage() {
  return <FutureGoals futureGoals={DATA.futureGoals} />;
}
