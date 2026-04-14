import { PortfolioData } from "@/data/portfolio";

export default function Footer({ name }: { name: PortfolioData["name"] }) {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>
        ✿ <span className="heart">♥</span> {name} &copy; {year} ✿
      </p>
    </footer>
  );
}
