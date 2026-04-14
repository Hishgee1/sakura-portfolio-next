import { DATA } from "@/data/portfolio";
import NotionSection from "@/components/NotionSection";

export default function NotesPage() {
  return <NotionSection notionUrl={DATA.notionUrl} contact={DATA.contact} />;
}
