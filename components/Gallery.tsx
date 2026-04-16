"use client";

import { useState, useRef, useMemo, ChangeEvent } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/data/portfolio";
import PhotoTree from "@/components/PhotoTree";

type Photo = { src: string; location: string; caption: string; date: string };
type Props = { initialPhotos: GalleryPhoto[] };

const SIZES = ["size-hero", "size-sm", "size-sm", "size-tall", "size-wide", "size-sm"] as const;

const GRADIENTS = [
  "linear-gradient(135deg,#E8A0BF,#B4A7D6)",
  "linear-gradient(135deg,#B4A7D6,#A8C5A0)",
  "linear-gradient(135deg,#FFCBA4,#E8A0BF)",
  "linear-gradient(135deg,#A8C5A0,#B4A7D6)",
  "linear-gradient(135deg,#E8A0BF,#FFCBA4)",
  "linear-gradient(135deg,#B4A7D6,#FFCBA4)",
];

const EMOJI_MAP: [string, string][] = [
  ["tokyo","🗼"],["japan","⛩️"],["osaka","🏮"],["korea","🇰🇷"],
  ["seoul","🏙️"],["thailand","🐘"],["singapore","🦁"],["mongolia","🏔️"],
  ["ulaanbaatar","🇲🇳"],["travel","✈️"],
];
function getEmoji(loc: string) {
  const l = loc.toLowerCase();
  return EMOJI_MAP.find(([k]) => l.includes(k))?.[1] ?? "📸";
}

type BranchView = { location: string; photos: Photo[] };

export default function Gallery({ initialPhotos }: Props) {
  const [photos, setPhotos]     = useState<Photo[]>(initialPhotos);
  const [failed, setFailed]     = useState<Set<number>>(new Set());
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [branch, setBranch]     = useState<BranchView | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Group by location */
  const byLocation = useMemo(() => {
    const map: Record<string, Photo[]> = {};
    photos.forEach(p => { (map[p.location] ??= []).push(p); });
    return map;
  }, [photos]);

  function handleClick(photo: Photo) {
    const siblings = byLocation[photo.location] ?? [];
    if (siblings.length > 1) {
      setBranch({ location: photo.location, photos: siblings });
    } else {
      setLightbox(photo);
    }
  }

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach(file => {
      const src = URL.createObjectURL(file);
      setPhotos(prev => [...prev, {
        src, location: "My Travel",
        caption: file.name.replace(/\.[^.]+$/, ""),
        date: String(new Date().getFullYear()),
      }]);
    });
    e.target.value = "";
  }

  return (
    <section id="gallery">
      <div className="gallery-header reveal">
        <p className="section-label">Аяллын цомог</p>
        <h2 className="section-title">Миний аялал ✈️</h2>
        <p className="section-desc">
          Замдаа үлдээсэн мөчүүд — сэтгэлд үлдсэн газрууд.
        </p>
      </div>

      <div className="gallery-grid">
        {Object.entries(byLocation).map(([location, list], i) => {
          const cover = list[0];
          const isBlob = cover.src.startsWith("blob:");
          const key = `${location}-${i}`;
          const coverIdx = photos.indexOf(cover);
          const isPlaceholder = failed.has(coverIdx);

          return (
            <button
              key={key}
              className={`gallery-card ${SIZES[i % SIZES.length]} reveal`}
              style={isPlaceholder ? { background: GRADIENTS[i % GRADIENTS.length] } : undefined}
              onClick={() => handleClick(cover)}
              aria-label={`${location} — ${list.length} зураг`}
            >
              {!isPlaceholder && (
                <div className="g-img">
                  <Image
                    src={cover.src} alt={location} fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width:600px) 100vw,(max-width:900px) 50vw,33vw"
                    unoptimized={isBlob}
                    onError={() => setFailed(prev => new Set(prev).add(coverIdx))}
                  />
                </div>
              )}

              {isPlaceholder && (
                <div className="g-placeholder">
                  <span className="g-placeholder-emoji">{getEmoji(location)}</span>
                  <span className="g-placeholder-loc">{location}</span>
                </div>
              )}

              {/* location pill */}
              <div className="g-pill">📍 {location}</div>

              {/* photo count badge */}
              <div className="g-count">{list.length} зураг</div>

              {/* hover overlay */}
              <div className={`g-overlay${isPlaceholder ? " g-overlay--show" : ""}`}>
                <p className="g-caption">{location}</p>
                <p className="g-date">{list.length} зураг</p>
              </div>
            </button>
          );
        })}

        <button className="gallery-add reveal" onClick={() => inputRef.current?.click()}>
          <span className="gallery-add-icon">+</span>
          <span className="gallery-add-label">Зураг нэмэх</span>
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple
        style={{ display: "none" }} onChange={handleFiles} />

      {/* ── Photo Tree view ───────────────────── */}
      {branch && (
        <PhotoTree
          location={branch.location}
          photos={branch.photos}
          onClose={() => setBranch(null)}
        />
      )}

      {/* ── Simple lightbox ───────────────────── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="lightbox-img-wrap">
              <Image src={lightbox.src} alt={lightbox.caption} fill
                style={{ objectFit: "contain" }} sizes="100vw"
                unoptimized={lightbox.src.startsWith("blob:")} />
            </div>
            <div className="lightbox-info">
              <p className="lightbox-location">📍 {lightbox.location}</p>
              <p className="lightbox-caption">{lightbox.caption}</p>
              <p className="lightbox-date">{lightbox.date}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
