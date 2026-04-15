"use client";

import { useEffect, useRef, useState } from "react";

/* ── Дуунуудын жагсаалт ── */
const SONGS: { id: string; title: string; artist: string; emoji: string; src: string }[] = [
  { id: "lover",   title: "Lover",   artist: "Taylor Swift", emoji: "🌸", src: "/music/bgm.mp4"     },
  { id: "forever", title: "Forever", artist: "A SOUND",      emoji: "🌺", src: "/music/forever.mp4" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [showPicker, setShowPicker] = useState(true);
  const [closing,    setClosing]    = useState(false);
  const [picked,     setPicked]     = useState<string | null>(null);
  const [playing,    setPlaying]    = useState(false);

  /* sessionStorage-д хадгалсан сонголт байвал picker-ийг харуулахгүй */
  useEffect(() => {
    const saved = sessionStorage.getItem("music-choice");
    if (saved) {
      setShowPicker(false);
      setPicked(saved);
    }
  }, []);

  const pick = (src: string) => {
    setClosing(true);
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.volume = 0.35;
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
    sessionStorage.setItem("music-choice", src);
    setPicked(src);
    setTimeout(() => setShowPicker(false), 650);
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el || !picked) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" />

      {/* ── Song picker overlay ── */}
      {showPicker && (
        <div className={`picker-overlay${closing ? " picker-overlay--closing" : ""}`}>
          <div className="picker-petals" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="picker-petal"
                style={{
                  left: `${(i * 7 + 3) % 100}%`,
                  animationDelay: `${(i * 0.4) % 5}s`,
                  animationDuration: `${6 + (i % 4) * 1.5}s`,
                  ["--pdrift" as string]: `${(i % 2 ? 1 : -1) * (30 + (i % 3) * 15)}px`,
                }}
              />
            ))}
          </div>

          <div className="picker-card">
            <p className="picker-label">🎵 Тавтай морил</p>
            <h1 className="picker-title">Ямар ая сонсмоор байна?</h1>
            <p className="picker-desc">
              Нэг дуу сонгоорой — сайтыг хаахгүйгээр бүхий л хуудсанд үргэлжлэн тоглоно.
            </p>

            <div className="picker-songs">
              {SONGS.map(song => (
                <button
                  key={song.id}
                  className="picker-song"
                  onClick={() => pick(song.src)}
                >
                  <span className="picker-song-emoji">{song.emoji}</span>
                  <div className="picker-song-info">
                    <span className="picker-song-title">{song.title}</span>
                    <span className="picker-song-artist">{song.artist}</span>
                  </div>
                  <span className="picker-song-play">▶</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Floating toggle button (picker хаагдсаны дараа зөвхөн дуу сонгосон үед) ── */}
      {picked && !showPicker && (
        <button
          className={`music-btn${playing ? " music-btn--on" : ""}`}
          onClick={toggle}
          aria-label={playing ? "Дууг зогсоох" : "Дуу тоглуулах"}
          title={playing ? "Дууг зогсоох" : "Дуу тоглуулах"}
        >
          <span className="music-ic">{playing ? "🔊" : "🎵"}</span>
          {playing && (
            <span className="music-waves" aria-hidden="true">
              <span /><span /><span />
            </span>
          )}
        </button>
      )}
    </>
  );
}
