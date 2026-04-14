"use client";

import { useEffect, useRef } from "react";
import { PortfolioData } from "@/data/portfolio";

type Props = Pick<PortfolioData, "skills">;

export default function Skills({ skills }: Props) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bars = barsRef.current?.querySelectorAll<HTMLElement>(".skill-fill");
    if (!bars) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          bars.forEach((el) => { el.style.width = el.dataset.level + "%"; });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (barsRef.current) observer.observe(barsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills">
      <div className="reveal">
        <p className="section-label">Skills</p>
        <h2 className="section-title">Technical expertise</h2>
        <p className="section-desc">
          Tools and technologies I work with every day to build reliable systems.
        </p>
      </div>
      <div className="skills-grid" ref={barsRef}>
        {skills.map((s) => (
          <div key={s.name} className="skill-card glass reveal">
            <div className="skill-icon">{s.icon}</div>
            <div className="skill-name">{s.name}</div>
            <div className="skill-desc">{s.desc}</div>
            <div className="skill-bar">
              <div className="skill-fill" data-level={s.level} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
