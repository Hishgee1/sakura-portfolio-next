"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PortfolioData } from "@/data/portfolio";

const LINKS = [
  { href: "/about",    label: "Бидний тухай" },
  { href: "/gallery",  label: "Аялал"     },
  { href: "/learn",    label: "Сургалт"     },
  { href: "/letters",  label: "Захиа"         },
  { href: "/future",   label: "Зорилго"     },
  { href: "/notes",    label: "Тэмдэглэл"   },
];

export default function Nav({ name }: { name: PortfolioData["name"] }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <Link href="/" className="logo">{name} ✿</Link>
      <ul className="nav-links">
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={pathname === href ? "active" : ""}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
