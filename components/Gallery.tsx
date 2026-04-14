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
        <p className="section-label">Travel Gallery</p>
        <h2 className="section-title">My adventures ✈️</h2>
        <p className="section-desc">
          Moments captured along the way — places that left a mark on me.
        </p>
      </div>

      <div className="gallery-grid">
        {photos.map((photo, i) => {
          const isBlob        = photo.src.startsWith("blob:");
          const isPlaceholder = failed.has(i);
          const siblings      = byLocation[photo.location]?.length ?? 0;

          return (
            <button
              key={i}
              className={`gallery-card ${SIZES[i % SIZES.length]} reveal`}
              style={isPlaceholder ? { background: GRADIENTS[i % GRADIENTS.length] } : undefined}
              onClick={() => handleClick(photo)}
              aria-label={`${photo.location} — ${photo.caption}`}
            >
              {!isPlaceholder && (
                <div className="g-img">
                  <Image
                    src={photo.src} alt={photo.caption} fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width:600px) 100vw,(max-width:900px) 50vw,33vw"
                    unoptimized={isBlob}
                    onError={() => setFailed(prev => new Set(prev).add(i))}
                  />
                </div>
              )}

              {isPlaceholder && (
                <div className="g-placeholder">
                  <span className="g-placeholder-emoji">{getEmoji(photo.location)}</span>
                  <span className="g-placeholder-loc">{photo.location}</span>
                </div>
              )}

              {/* location pill */}
              <div className="g-pill">📍 {photo.location}</div>

              {/* multi-photo badge */}
              {siblings > 1 && (
                <div className="g-count">{siblings} зураг</div>
              )}

              {/* hover overlay */}
              <div className={`g-overlay${isPlaceholder ? " g-overlay--show" : ""}`}>
                <p className="g-caption">{photo.caption}</p>
                <p className="g-date">{photo.date}</p>
              </div>
            </button>
          );
        })}

        <button className="gallery-add reveal" onClick={() => inputRef.current?.click()}>
          <span className="gallery-add-icon">+</span>
          <span className="gallery-add-label">Add photo</span>
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
