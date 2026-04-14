"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Photo = { src: string; location: string; caption: string; date: string };
type Props = { location: string; photos: Photo[]; onClose: () => void };

/* Leaf positions — aligned to branch tips of the new sakura tree SVG (viewBox 1000×760) */
const POSITIONS = [
  { left: "43%", top: "12%", size: 72,  sway: "pt-sway1" }, // top-center left tip
  { left: "49%", top: "11%", size: 72,  sway: "pt-sway3" }, // top-center right tip
  { left: "20%", top: "22%", size: 78,  sway: "pt-sway2" }, // left-up tip
  { left: "27%", top: "20%", size: 75,  sway: "pt-sway4" }, // left-up inner tip
  { left: "39%", top: "27%", size: 80,  sway: "pt-sway1" }, // center-left mid
  { left: "54%", top: "26%", size: 80,  sway: "pt-sway3" }, // center-right mid
  { left: "65%", top: "20%", size: 75,  sway: "pt-sway2" }, // right-up inner tip
  { left: "73%", top: "20%", size: 78,  sway: "pt-sway4" }, // right-up tip
  { left:  "8%", top: "27%", size: 76,  sway: "pt-sway1" }, // far-left tip a
  { left: "14%", top: "23%", size: 74,  sway: "pt-sway2" }, // far-left tip b
  { left: "81%", top: "23%", size: 74,  sway: "pt-sway3" }, // far-right tip b
  { left: "87%", top: "27%", size: 76,  sway: "pt-sway4" }, // far-right tip a
  { left: "46%", top: "38%", size: 90,  sway: "pt-sway2" }, // center fork
  { left: "29%", top: "46%", size: 96,  sway: "pt-sway1" }, // main left fork
  { left: "65%", top: "46%", size: 96,  sway: "pt-sway3" }, // main right fork
];

const LEAF_GRADS = [
  "linear-gradient(135deg,#FFB2D1,#FFD6E8)",
  "linear-gradient(135deg,#D4B8FF,#EDE0FF)",
  "linear-gradient(135deg,#B8F0D8,#D8F8EB)",
  "linear-gradient(135deg,#B8E4FF,#D4EFFF)",
  "linear-gradient(135deg,#FFDAB9,#FFE8D0)",
  "linear-gradient(135deg,#FFF3B0,#FFF9DA)",
  "linear-gradient(135deg,#FFB2D1,#D4B8FF)",
  "linear-gradient(135deg,#A8C5A0,#B8F0D8)",
];

/* Sakura flower branch decoration positions (cx, cy in SVG coords) */
const FLOWERS = [
  [295,348],[155,258],[252,222],[660,350],[802,260],
  [695,220],[468,290],[460,155],[400,218],[540,215],
];

/* Falling petals config */
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left:     `${4 + i * 7}%`,
  delay:    `${(i * 1.1) % 9}s`,
  duration: `${7 + (i % 5) * 1.5}s`,
  size:     8 + (i % 3) * 5,
  drift:    (i % 2 === 0 ? 1 : -1) * (30 + (i % 3) * 20),
}));

export default function PhotoTree({ location, photos, onClose }: Props) {
  const [active, setActive] = useState<Photo | null>(null);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const leavesRef = useRef<(HTMLDivElement | null)[]>([]);

  /* Mouse parallax */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) *  5;
      leavesRef.current.forEach((el, i) => {
        if (!el) return;
        const f = (i % 4 + 1) * 0.25;
        el.style.marginLeft = `${x * f}px`;
        el.style.marginTop  = `${y * f}px`;
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* Escape */
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") active ? setActive(null) : onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, onClose]);

  return (
    <div className="ptree-overlay">

      {/* ── Falling cherry blossom petals ── */}
      <div className="ptree-petals" aria-hidden="true">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="ptree-petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              // CSS custom property for drift direction
              ["--drift" as string]: `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <div className="ptree-header">
        <span className="ptree-loc">🌸 {location} · {photos.length} зураг</span>
        <button className="ptree-close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      {/* ── Tree scene ── */}
      <div className="ptree-scene">
        <div className="ptree-container">

          {/* SVG sakura tree */}
          <svg
            className="ptree-svg"
            viewBox="0 0 1000 760"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="490" cy="750" rx="200" ry="11" fill="#B89A78" opacity="0.22"/>

            {/* Trunk */}
            <path d="M490,754 C487,650 482,570 479,490"
              stroke="#6B4A28" strokeWidth="28" fill="none" strokeLinecap="round"/>
            <path d="M490,754 C494,650 490,570 487,492"
              stroke="#9A7250" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.25"/>

            {/* Main left branch */}
            <path d="M479,490 C432,442 372,392 295,348"
              stroke="#7A5538" strokeWidth="18" fill="none" strokeLinecap="round"/>
            {/* Main right branch */}
            <path d="M479,490 C528,440 592,390 660,350"
              stroke="#7A5538" strokeWidth="18" fill="none" strokeLinecap="round"/>
            {/* Center up */}
            <path d="M479,490 C476,426 473,362 468,290"
              stroke="#7A5538" strokeWidth="15" fill="none" strokeLinecap="round"/>

            {/* Left sub: far-left */}
            <path d="M295,348 C250,306 206,276 155,258"
              stroke="#8B6545" strokeWidth="11" fill="none" strokeLinecap="round"/>
            {/* Left sub: left-up */}
            <path d="M295,348 C280,300 265,258 252,222"
              stroke="#8B6545" strokeWidth="11" fill="none" strokeLinecap="round"/>
            {/* Far-left tips */}
            <path d="M155,258 C130,232 108,215 83,204"
              stroke="#9B7555" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M155,258 C150,225 147,198 144,174"
              stroke="#9B7555" strokeWidth="7" fill="none" strokeLinecap="round"/>
            {/* Left-up tips */}
            <path d="M252,222 C234,198 217,180 198,167"
              stroke="#9B7555" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M252,222 C262,195 271,172 274,151"
              stroke="#9B7555" strokeWidth="6" fill="none" strokeLinecap="round"/>

            {/* Right sub: far-right */}
            <path d="M660,350 C706,308 752,279 802,260"
              stroke="#8B6545" strokeWidth="11" fill="none" strokeLinecap="round"/>
            {/* Right sub: right-up */}
            <path d="M660,350 C675,302 688,258 694,220"
              stroke="#8B6545" strokeWidth="11" fill="none" strokeLinecap="round"/>
            {/* Far-right tips */}
            <path d="M802,260 C828,234 852,218 874,207"
              stroke="#9B7555" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M802,260 C808,228 812,200 812,174"
              stroke="#9B7555" strokeWidth="7" fill="none" strokeLinecap="round"/>
            {/* Right-up tips */}
            <path d="M694,220 C710,194 722,174 730,154"
              stroke="#9B7555" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M694,220 C682,193 672,170 658,151"
              stroke="#9B7555" strokeWidth="6" fill="none" strokeLinecap="round"/>

            {/* Center sub-branches */}
            <path d="M468,290 C445,255 420,225 394,202"
              stroke="#8B6545" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M468,290 C496,252 521,220 545,200"
              stroke="#8B6545" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M468,290 C465,240 462,194 459,154"
              stroke="#8B6545" strokeWidth="9"  fill="none" strokeLinecap="round"/>
            {/* Center top tips */}
            <path d="M459,154 C449,127 441,107 433,87"
              stroke="#AB8565" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M459,154 C470,127 479,105 486,84"
              stroke="#AB8565" strokeWidth="5" fill="none" strokeLinecap="round"/>

            {/* ── Decorative sakura flowers on branch junctions ── */}
            {FLOWERS.map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx},${cy})`} opacity="0.52">
                {[0,72,144,216,288].map(angle => (
                  <ellipse
                    key={angle}
                    cx="0" cy="-7" rx="3.8" ry="5.5"
                    fill={i % 2 === 0 ? "#FFB8D4" : "#FFC8E2"}
                    transform={`rotate(${angle})`}
                  />
                ))}
                <circle cx="0" cy="0" r="2.8" fill="#FFF0F5"/>
                <circle cx="0" cy="0" r="1.2" fill="#FFD6E8"/>
              </g>
            ))}

            {/* Small foliage dots */}
            <g opacity="0.35">
              {[[195,315],[375,418],[545,398],[608,298],[345,255],[475,196]].map(([x,y],i)=>(
                <ellipse key={i} cx={x} cy={y} rx="10" ry="5" fill="#A8D898"
                  transform={`rotate(${-25+i*14} ${x} ${y})`}/>
              ))}
            </g>
          </svg>

          {/* ── Photo leaves ── */}
          {photos.map((photo, i) => {
            const pos    = POSITIONS[i % POSITIONS.length];
            const hasErr = errors.has(i);
            const grad   = LEAF_GRADS[i % LEAF_GRADS.length];
            return (
              <div
                key={i}
                ref={el => { leavesRef.current[i] = el; }}
                className={`ptree-leaf ${pos.sway}`}
                style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size }}
                onClick={() => setActive(photo)}
                role="button"
                tabIndex={0}
                aria-label={photo.caption}
              >
                <div className="ptree-circle" style={hasErr ? { background: grad } : undefined}>
                  {!hasErr && (
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes={`${pos.size}px`}
                      unoptimized={photo.src.startsWith("blob:")}
                      onError={() => setErrors(prev => new Set(prev).add(i))}
                    />
                  )}
                </div>
                <span className="ptree-caption">{photo.caption}</span>
              </div>
            );
          })}

          {/* Ground strip */}
          <div className="ptree-ground" />
        </div>
      </div>

      {/* ── Lightbox ── */}
      {active && (
        <div className="ptree-lb" onClick={() => setActive(null)}>
          <div className="ptree-lb-card" onClick={e => e.stopPropagation()}>
            <div className="ptree-lb-circle">
              <Image
                src={active.src}
                alt={active.caption}
                fill
                style={{ objectFit: "cover" }}
                sizes="320px"
                unoptimized={active.src.startsWith("blob:")}
              />
            </div>
            <p className="ptree-lb-caption">{active.caption}</p>
            <p className="ptree-lb-date">📍 {active.location} · {active.date}</p>
            <button className="ptree-lb-close" onClick={() => setActive(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
