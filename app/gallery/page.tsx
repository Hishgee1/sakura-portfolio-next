import { DATA } from "@/data/portfolio";
import Gallery from "@/components/Gallery";

export default function GalleryPage() {
  return <Gallery initialPhotos={DATA.gallery} />;
}
