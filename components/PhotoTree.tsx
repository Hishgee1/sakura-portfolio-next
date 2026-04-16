"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

type Photo = { src: string; location: string; caption: string; date: string };
type Props = { location: string; photos: Photo[]; onClose: () => void };

/* Монголын цагаар шөнө мөн үү? (19:00–07:00) */
function useIsNight() {
  const [isNight, setIsNight] = useState(false);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const mnHour = (now.getUTCHours() + 8) % 24;
      setIsNight(mnHour >= 19 || mnHour < 7);
    };
    check();
    const iv = setInterval(check, 60_000);
    return () => clearInterval(iv);
  }, []);
  return isNight;
}

/* Унаж буй сакура дэлбээ — тогтмол байрлал */
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  left:     (i * 37) % 100,
  delay:    (i * 0.55) % 8,
  duration: 6 + ((i * 3) % 7),
  size:     8 + ((i * 5) % 10),
}));

/* Шөнийн одод */
type Star = { x: number; y: number; size: number; opacity: number; twinkle: number; delay: number; bright: boolean };
function makeStars(n: number): Star[] {
  return Array.from({ length: n }, (_, i) => {
    const bright = ((i * 17) % 100) < 8;
    return {
      x: (i * 53) % 100,
      y: ((i * 29) % 100),
      size: bright ? 2.5 + ((i * 7) % 15) / 10 : 0.8 + ((i * 11) % 15) / 10,
      opacity: 0.35 + ((i * 13) % 65) / 100,
      twinkle: 2 + ((i * 19) % 40) / 10,
      delay: ((i * 23) % 50) / 10,
      bright,
    };
  });
}

/* Пирамид layout — олон зурагт бие биетэйгээ давалдахгүй автоматаар өргөсөж байна */
function makePositions(n: number) {
  type Pos = { x: number; yPx: number; size: number; delay: number };
  const MAX_PER_ROW = 5;
  const ROW_HEIGHT  = 170; // px — мөр хоорондын зай
  const rows: number[] = [];
  let remaining = n;
  let r = 1;
  while (remaining > 0) {
    const cnt = Math.min(r, MAX_PER_ROW, remaining);
    rows.push(cnt);
    remaining -= cnt;
    if (r < MAX_PER_ROW) r++;
  }
  const positions: Pos[] = [];
  let idx = 0;
  rows.forEach((cnt, ri) => {
    const yPx  = 70 + ri * ROW_HEIGHT;
    const size = ri === 0 ? 150 : Math.max(115, 140 - ri * 4);
    for (let i = 0; i < cnt; i++) {
      const xSpacing = 92 / (cnt + 1);
      const x = 4 + xSpacing * (i + 1);
      positions.push({ x, yPx, size, delay: idx * 0.06 });
      idx++;
    }
  });
  const stageHeight = 70 + rows.length * ROW_HEIGHT + 40;
  return { positions, stageHeight };
}

/* Япон бичиг footer */
function jpFooter(loc: string, night: boolean): string {
  const l = loc.toLowerCase();
  const suffix = night ? "の星空" : "の思い出";
  if (l.includes("tokyo"))    return `東京${suffix}`;
  if (l.includes("osaka"))    return `大阪${suffix}`;
  if (l.includes("dubai"))    return `ドバイ${suffix}`;
  if (l.includes("shanghai") || l.includes("shankhai")) return `上海${suffix}`;
  if (l.includes("ulaanbaatar")) return `ウランバートル${suffix}`;
  return `旅${suffix}`;
}

export default function PhotoTree({ location, photos, onClose }: Props) {
  const [active, setActive] = useState<Photo | null>(null);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const isNight = useIsNight();
  const stars = useMemo(() => makeStars(220), []);
  const [shoot, setShoot] = useState<{ id: number; x: number; y: number; angle: number; dur: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") active ? setActive(null) : onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);

  /* Одноор унах од — зөвхөн шөнө */
  useEffect(() => {
    if (!isNight) return;
    const spawn = () => {
      setShoot({
        id: Date.now(),
        x: 10 + Math.random() * 60,
        y: 5 + Math.random() * 30,
        angle: 15 + Math.random() * 30,
        dur: 0.8 + Math.random() * 0.6,
      });
      setTimeout(() => setShoot(null), 1500);
    };
    const t = setTimeout(spawn, 2000);
    const iv = setInterval(spawn, 5000 + Math.random() * 5000);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, [isNight]);

  const { positions, stageHeight } = makePositions(photos.length);
  const [city, country] = location.split(",").map(s => s.trim());

  return (
    <div className={`ptree-overlay${isNight ? " ptree-overlay--night" : ""}`}>

      {/* Night-only: nebula + stars + shooting star */}
      {isNight && (
        <>
          <div className="ptree-nebula" aria-hidden="true">
            <span className="ptree-neb n1" />
            <span className="ptree-neb n2" />
            <span className="ptree-neb n3" />
            <span className="ptree-neb n4" />
          </div>
          <div className="ptree-stars" aria-hidden="true">
            {stars.map((s, i) => (
              <span
                key={i}
                className={s.bright ? "ptree-star ptree-star--bright" : "ptree-star"}
                style={{
                  left: `${s.x}%`,
                  top:  `${s.y}%`,
                  width:  s.size,
                  height: s.size,
                  opacity: s.opacity,
                  animationDuration: `${s.twinkle}s`,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}
          </div>
          {shoot && (
            <span
              key={shoot.id}
              className="ptree-shoot"
              style={{
                left: `${shoot.x}%`,
                top:  `${shoot.y}%`,
                transform: `rotate(${shoot.angle}deg)`,
                animationDuration: `${shoot.dur}s`,
              }}
            />
          )}
        </>
      )}

      {/* Falling petals */}
      <div className="ptree-petals" aria-hidden="true">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="ptree-petal"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Background decorative circles */}
      <div className="ptree-bg-circles" aria-hidden="true">
        <span style={{ left: "10%", top: "15%", width: 300, height: 300 }} />
        <span style={{ left: "75%", top: "10%", width: 200, height: 200 }} />
        <span style={{ left: "85%", top: "70%", width: 250, height: 250 }} />
        <span style={{ left:  "5%", top: "80%", width: 180, height: 180 }} />
        <span style={{ left: "50%", top: "85%", width: 350, height: 350 }} />
      </div>

      {/* Header */}
      <div className={`ptree-header${loaded ? " ptree-header--in" : ""}`}>
        <p className="ptree-eyebrow">Travel Memories</p>
        <h1 className="ptree-title">{city}</h1>
        <div className="ptree-meta">
          <span className="ptree-meta-line" />
          <span className="ptree-meta-text">
            {country}{country ? " · " : ""}{photos.length} зураг
          </span>
          <span className="ptree-meta-line" />
        </div>
      </div>

      <button className="ptree-close-x" onClick={onClose} aria-label="Хаах">✕</button>

      {/* Orb stage */}
      <div className="ptree-orb-stage" style={{ height: stageHeight }}>
        {photos.map((photo, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const hasErr = errors.has(i);
          return (
            <button
              key={i}
              className={`ptree-orb${loaded ? " ptree-orb--in" : ""}`}
              style={{
                left: `calc(${pos.x}% - ${pos.size / 2}px)`,
                top:  `calc(${pos.yPx}px - ${pos.size / 2}px)`,
                width:  pos.size,
                height: pos.size,
                animationDelay: `${pos.delay}s`,
              }}
              onClick={() => setActive(photo)}
              aria-label={photo.caption}
            >
              <span className="ptree-ring" />
              <div className="ptree-circle">
                {!hasErr ? (
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes={`${pos.size}px`}
                    unoptimized={photo.src.startsWith("blob:")}
                    onError={() => setErrors(prev => new Set(prev).add(i))}
                  />
                ) : (
                  <div className="ptree-ph">📸</div>
                )}
                <span className="ptree-shine" />
              </div>
              <span className="ptree-orb-label">{photo.caption}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`ptree-footer${loaded ? " ptree-footer--in" : ""}`}>
        <span className="ptree-footer-jp">{jpFooter(location, isNight)}</span>
      </div>

      {/* Lightbox */}
      {active && (
        <div className="ptree-lb" onClick={() => setActive(null)}>
          <div className="ptree-lb-circle" onClick={e => e.stopPropagation()}>
            <Image
              src={active.src}
              alt={active.caption}
              fill
              style={{ objectFit: "cover" }}
              sizes="320px"
              unoptimized={active.src.startsWith("blob:")}
            />
            <span className="ptree-shine" />
          </div>
          <div className="ptree-lb-info">
            <p className="ptree-lb-caption">{active.caption}</p>
            <p className="ptree-lb-loc">{location}</p>
          </div>
          <button className="ptree-lb-close" onClick={() => setActive(null)}>
            Хаах
          </button>
        </div>
      )}
    </div>
  );
}
