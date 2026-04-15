"use client";

import { useState } from "react";
import { LearnItem, KanjiCard } from "@/data/portfolio";

type Props = { learn: LearnItem[]; kanji: KanjiCard[] };
type Tab = "video" | "book" | "test" | "kanji";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "video", label: "Бичлэг",  icon: "📺" },
  { id: "book",  label: "Ном",     icon: "📚" },
  { id: "test",  label: "Шалгалт", icon: "📝" },
  { id: "kanji", label: "Ханз",    icon: "✍️" },
];

const LEVELS = ["Бүгд", "N5", "N4", "N3", "N2", "N1"];

const LEVEL_COLORS: Record<string, string> = {
  N5: "#A8C5A0", N4: "#B4A7D6", N3: "#E8A0BF",
  N2: "#FFCBA4", N1: "#D4789C",
};

export default function Learn({ learn, kanji }: Props) {
  const [tab, setTab]               = useState<Tab>("video");
  const [kanjiLevel, setKanjiLevel] = useState("Бүгд");
  const [flipped, setFlipped]       = useState<Set<number>>(new Set());
  const [pdfViewer, setPdfViewer]   = useState<{ title: string; src: string } | null>(null);

  function toggleFlip(i: number) {
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function handleCardClick(item: LearnItem) {
    if (item.type === "book") {
      if (item.src) {
        setPdfViewer({ title: item.title, src: item.src });
      }
      // href="#" books with no src: do nothing (shown as "PDF нэмэгдээгүй")
    }
    // video/test: handled by <a> tag
  }

  const filtered = tab === "kanji"
    ? kanji.filter(k => kanjiLevel === "Бүгд" || k.level === kanjiLevel)
    : learn.filter(item => item.type === tab);

  return (
    <section id="learn">
      <div className="reveal">
        <p className="section-label">Сургалт</p>
        <h2 className="section-title">Суралцах эх сурвалж ✍️</h2>
        <p className="section-desc">
          Япон &amp; Англи хэлний материал — бичлэг, ном, шалгалт, ханз дасгал.
        </p>
      </div>

      {/* Tabs */}
      <div className="learn-tabs reveal">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`learn-tab${tab === t.id ? " learn-tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Kanji level filter */}
      {tab === "kanji" && (
        <div className="learn-levels reveal">
          {LEVELS.map(lv => (
            <button
              key={lv}
              className={`learn-level${kanjiLevel === lv ? " learn-level--active" : ""}`}
              style={kanjiLevel === lv && lv !== "Бүгд"
                ? { background: LEVEL_COLORS[lv], borderColor: LEVEL_COLORS[lv] }
                : undefined}
              onClick={() => { setKanjiLevel(lv); setFlipped(new Set()); }}
            >
              {lv}
            </button>
          ))}
        </div>
      )}

      {/* Resource cards */}
      {tab !== "kanji" && (
        <div className="learn-grid">
          {(filtered as LearnItem[]).map((item, i) => {
            const isBook   = item.type === "book";
            const hasPdf   = isBook && !!item.src;
            const hasLink  = !isBook && item.href !== "#";
            const Tag      = isBook ? "button" : "a";
            const extraProps = isBook
              ? { onClick: () => handleCardClick(item), type: "button" as const }
              : { href: item.href, target: "_blank", rel: "noopener noreferrer" };

            return (
              <Tag
                key={i}
                className={`learn-card glass reveal${isBook && !hasPdf ? " learn-card--locked" : ""}`}
                {...(extraProps as object)}
              >
                <div className="learn-card-top">
                  <span className="learn-icon">{item.icon}</span>
                  <span
                    className="learn-badge"
                    style={{ background: LEVEL_COLORS[item.level.split("~")[0]] ?? "var(--rose)" }}
                  >
                    {item.level}
                  </span>
                </div>

                <h3 className="learn-title">{item.title}</h3>
                <p className="learn-desc">{item.desc}</p>

                <div className="learn-tags">
                  {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>

                <div className="learn-action">
                  {isBook && hasPdf  && <span className="learn-open">📖 Нээж унших →</span>}
                  {isBook && !hasPdf && <span className="learn-locked">📂 PDF нэмэгдээгүй</span>}
                  {!isBook && hasLink && <span className="learn-open">Үзэх →</span>}
                </div>
              </Tag>
            );
          })}
        </div>
      )}

      {/* Kanji flip cards */}
      {tab === "kanji" && (
        <div className="kanji-grid">
          {(filtered as KanjiCard[]).map((k, i) => (
            <button
              key={`${k.kanji}-${i}`}
              className={`kanji-card reveal${flipped.has(i) ? " kanji-card--flipped" : ""}`}
              onClick={() => toggleFlip(i)}
            >
              <div className="kanji-inner">
                <div className="kanji-face kanji-front">
                  <span className="kanji-char" style={{ color: LEVEL_COLORS[k.level] ?? "var(--rose-deep)" }}>
                    {k.kanji}
                  </span>
                  <span className="kanji-level-badge" style={{ background: LEVEL_COLORS[k.level] }}>
                    {k.level}
                  </span>
                  <span className="kanji-hint">дарж харах ↩</span>
                </div>
                <div className="kanji-face kanji-back">
                  <span className="kanji-char kanji-char--sm">{k.kanji}</span>
                  <p className="kanji-reading">{k.reading}</p>
                  <p className="kanji-meaning">{k.meaning}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdfViewer && (
        <div className="pdf-modal" onClick={() => setPdfViewer(null)}>
          <div className="pdf-inner" onClick={e => e.stopPropagation()}>
            <div className="pdf-header">
              <span className="pdf-title">📖 {pdfViewer.title}</span>
              <button className="lightbox-close" onClick={() => setPdfViewer(null)}>✕</button>
            </div>
            <iframe
              src={pdfViewer.src}
              className="pdf-frame"
              title={pdfViewer.title}
            />
          </div>
        </div>
      )}
    </section>
  );
}
