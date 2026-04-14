import { DATA } from "@/data/portfolio";
import Projects from "@/components/Projects";

export default function ProjectsPage() {
  return <Projects projects={DATA.projects} />;
}
