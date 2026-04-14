"use client";

import { PortfolioData } from "@/data/portfolio";
import Image from "next/image";

type Props = Pick<PortfolioData, "about" | "skills" | "name" | "tagline">;

const TAG_COLORS = ["tag-rose", "tag-lavender", "tag-sage", "tag-peach"];

export default function About({ about, skills, name, tagline }: Props) {
  return (
    <section id="about">

      {/* ── Top grid: photo + bio ── */}
      <div className="about-grid reveal">

        {/* Profile photo */}
        <div className="about-photo-wrap">
          <div className="about-photo-ring">
            <div className="about-photo-img">
              <Image
                src="/profile.jpg"
                alt={name}
                fill
                style={{ objectFit: "cover" }}
                sizes="320px"
              />
            </div>
          </div>
          <div className="about-photo-badge glass">
            <span className="about-badge-dot" />
            Available for work
          </div>
        </div>

        {/* Bio */}
        <div className="about-text">
          <p className="section-label">About me</p>
          <h2 className="section-title">A bit about {name}</h2>
          <p>{tagline}</p>
          <p>
            Always learning, always building — let&apos;s create something together.
          </p>

          <div className="about-tags">
            {about.map((item, i) => (
              <span key={item.label} className={`tag-pill ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                <span className="tag-pill-label">{item.label}</span>
                <span className="tag-pill-value">{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="about-skills reveal">
        <p className="section-label" style={{ marginBottom: "1.5rem" }}>Skills &amp; Tools</p>
        <div className="skills-grid">
          {skills.map(skill => (
            <div key={skill.name} className="skill-card glass">
              <span className="skill-icon">{skill.icon}</span>
              <p className="skill-name">{skill.name}</p>
              <p className="skill-desc">{skill.desc}</p>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
