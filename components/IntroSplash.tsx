"use client";

import { useEffect, useState } from "react";

const PETALS = Array.from({ length: 22 }, () => ({
  left:     `${Math.random() * 100}%`,
  delay:    `${Math.random() * 1.5}s`,
  duration: `${3 + Math.random() * 3}s`,
  size:     10 + Math.random() * 14,
  drift:    (Math.random() - 0.5) * 180,
}));

export default function IntroSplash() {
  const [started, setStarted] = useState(false);
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  /* Дуу сонгогдтол (sessionStorage-д music-choice орж иртэл) хүлээнэ */
  useEffect(() => {
    if (sessionStorage.getItem("music-choice")) {
      setStarted(true);
      return;
    }
    const iv = setInterval(() => {
      if (sessionStorage.getItem("music-choice")) {
        setStarted(true);
        clearInterval(iv);
      }
    }, 200);
    return () => clearInterval(iv);
  }, []);

  /* Дуу сонгогдсоны дараа анимаци эхэлнэ */
  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => setHide(true), 2600);
    const t2 = setTimeout(() => setGone(true), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [started]);

  if (!started || gone) return null;

  return (
    <div className={`intro-splash${hide ? " intro-splash--hide" : ""}`}>
      {/* Falling petals */}
      <div className="intro-petals" aria-hidden="true">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="intro-petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              ["--drift" as string]: `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Blooming sakura flower */}
      <div className="intro-flower">
        <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="petalGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor="#FFF0F5"/>
              <stop offset="55%"  stopColor="#FFC8DE"/>
              <stop offset="100%" stopColor="#FF8FB0"/>
            </radialGradient>
            <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#FFF5B8"/>
              <stop offset="100%" stopColor="#F0B868"/>
            </radialGradient>
          </defs>

          {/* 5 petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`} className={`intro-petal-svg intro-petal-${i}`}>
              <path
                d="M0,-10 C-32,-48 -28,-82 0,-90 C28,-82 32,-48 0,-10 Z"
                fill="url(#petalGrad)"
                stroke="#FFB2D1"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              {/* petal vein */}
              <path d="M0,-15 L0,-78" stroke="#FF9FC0" strokeWidth="0.8" opacity="0.5"/>
              {/* notch at tip */}
              <path d="M-3,-86 L0,-80 L3,-86" stroke="#FFB2D1" strokeWidth="1.2" fill="none" strokeOpacity="0.7"/>
            </g>
          ))}

          {/* Stamens */}
          <g className="intro-stamens">
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => (
              <g key={i} transform={`rotate(${a})`}>
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#E6A030" strokeWidth="1.2"/>
                <circle cx="0" cy="-17" r="1.6" fill="#FFD060"/>
              </g>
            ))}
          </g>

          {/* Center */}
          <circle cx="0" cy="0" r="8" fill="url(#centerGrad)" className="intro-center"/>
        </svg>
      </div>

      {/* Greeting text */}
      <p className="intro-text">Сайн уу ✿</p>
    </div>
  );
}
