import { PortfolioData } from "@/data/portfolio";

type Props = Pick<PortfolioData, "projects">;

const CARD_STYLES = ["card-image-1", "card-image-2", "card-image-3"];
const CARD_EMOJIS = ["🗄️", "📊", "🔒"];

export default function Projects({ projects }: Props) {
  return (
    <section id="projects">
      <div className="reveal">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Selected work</h2>
        <p className="section-desc">
          A few projects I&apos;m proud of — each one built with care and purpose.
        </p>
      </div>
      <div className="portfolio-grid">
        {projects.map((p, i) => (
          <div key={p.name} className="portfolio-card glass reveal">
            <div className={`card-image ${CARD_STYLES[i % CARD_STYLES.length]}`}>
              <span className="card-emoji">{CARD_EMOJIS[i % CARD_EMOJIS.length]}</span>
              <span className="card-category">{p.tags[0]}</span>
            </div>
            <div className="card-body">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <div className="card-links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="card-link">
                    GitHub ↗
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="card-link">
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
