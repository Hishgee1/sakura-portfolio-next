"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PortfolioData } from "@/data/portfolio";

type Props = Pick<PortfolioData, "name" | "role" | "tagline" | "available">;

export default function Hero({ name, role, tagline }: Props) {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero">
      <div className="hero-inner">
        <p className="hero-greeting">Сайн уу ✿</p>
        <h1>
          Hi, I&apos;m <span className="accent">{name}</span>
        </h1>
        <p style={{ color: "var(--muted)", fontWeight: 500, marginBottom: "0.5rem" }}>{role}</p>
        <p className="hero-desc">{tagline}</p>

        <div className={`hero-cta${showBtn ? " hero-cta--visible" : ""}`}>
          <Link href="/about" className="btn btn-primary">
            About хуудас үзэх →
          </Link>
        </div>
      </div>
    </section>
  );
}
