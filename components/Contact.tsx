import { PortfolioData } from "@/data/portfolio";

type Props = Pick<PortfolioData, "contact">;

export default function Contact({ contact }: Props) {
  return (
    <section id="contact">
      <div className="contact-box glass reveal">
        <p className="section-label">Contact</p>
        <h2 className="section-title">Let&apos;s connect ✿</h2>
        <p className="section-desc">
          Open to opportunities, collaborations, or just a good conversation about tech.
        </p>
        <div className="social-links">
          {contact.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="social-link"
              title={c.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
