import Image from "next/image";
import { PortfolioData } from "@/data/portfolio";

type Props = Pick<PortfolioData, "futureGoals">;

export default function FutureGoals({ futureGoals }: Props) {
  return (
    <section id="future">
      <div className="reveal">
        <p className="section-label">Ирээдүйн зорилго</p>
        <h2 className="section-title">Бидний хүсэл мөрөөдөл</h2>
        <p className="section-desc">
          Намайг өдөр бүр урагшаа хөтлөх мөрөөдөл, зорилтууд.
        </p>
      </div>
      <div className="future-grid">
        {futureGoals.map((goal) => (
          <div key={goal.title} className="future-card reveal">
            <div className="future-image-wrap">
              <Image
                src={goal.image}
                alt={goal.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 1100px"
              />
              <div className="future-overlay" />
              <div className="future-badge">🎓</div>
            </div>
            <div className="future-body">
              <div className="future-title">{goal.title}</div>
              <div className="future-subtitle">{goal.subtitle}</div>
              <p className="future-desc">{goal.desc}</p>
              <div className="tag-row">
                {goal.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
