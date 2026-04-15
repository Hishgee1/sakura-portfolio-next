"use client";

import { useEffect, useState, FormEvent } from "react";

const VALID = ["SAKURA", "SASUKE"] as const;
const KEY = "sakura-user";

export default function NameGate() {
  const [ready, setReady] = useState(false);
  const [user,  setUser]  = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) setUser(saved);
    } catch {}
    setReady(true);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const name = input.trim().toUpperCase();
    if (!name) {
      setError("Нэрээ оруулна уу");
      return;
    }
    if (!VALID.includes(name as typeof VALID[number])) {
      setError("Зөвхөн SAKURA эсвэл SASUKE байж болно");
      return;
    }
    try { sessionStorage.setItem(KEY, name); } catch {}
    setUser(name);
    /* Бүх компонентыг дахин унших */
    setTimeout(() => window.location.reload(), 350);
  };

  if (!ready) return null;
  if (user)   return null;

  return (
    <div className="namegate-overlay">
      <div className="namegate-petals" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="picker-petal"
            style={{
              left: `${(i * 10 + 5) % 100}%`,
              animationDelay: `${(i * 0.5) % 4}s`,
              animationDuration: `${7 + (i % 3) * 2}s`,
              ["--pdrift" as string]: `${(i % 2 ? 1 : -1) * 40}px`,
            }}
          />
        ))}
      </div>

      <form className="namegate-card" onSubmit={submit}>
        <p className="namegate-label">✿ Тавтай морил ✿</p>
        <h1 className="namegate-title">Та хэн бэ?</h1>
        <p className="namegate-desc">Өөрийн нэрээ оруулж нэвтэрнэ үү</p>

        <input
          autoFocus
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
          placeholder=""
          className="namegate-input"
          maxLength={10}
          spellCheck={false}
          autoComplete="off"
        />

        {error && <p className="namegate-error">{error}</p>}

        <button type="submit" className="btn btn-primary namegate-btn">
          Нэвтрэх →
        </button>
      </form>
    </div>
  );
}
