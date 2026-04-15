"use client";

import { useState, useEffect } from "react";

type Author = "Sasuke" | "Sakura";

type Letter = {
  id:      string;
  from:    Author;
  to:      Author;
  message: string;
  date:    string;
  color:   string;
};

const AUTHOR_COLORS: Record<Author, string> = {
  Sasuke: "#D6E8FF", // хөх
  Sakura: "#FFD6E8", // ягаан
};
const other = (a: Author): Author => (a === "Sasuke" ? "Sakura" : "Sasuke");

const USER_KEY    = "sakura-user";
const READ_KEY    = "sakura-letters-read";
const NOTIFY_KEY  = "sakura-letters-notified"; // session-ийн турш нэг л удаа notification

/* SAKURA → Sakura */
const titleCase = (s: string): Author =>
  (s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()) as Author;

export default function Letters() {
  const [me, setMe]           = useState<Author | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [active, setActive]   = useState<Letter | null>(null);
  const [writing, setWriting] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [dodgeX, setDodgeX]         = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeLater, setDodgeLater] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  /* Load on mount — cloud-аас татна */
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem(USER_KEY);
      if (savedUser) setMe(titleCase(savedUser));

      const rawRead = localStorage.getItem(READ_KEY);
      const read: Set<string> = new Set(rawRead ? JSON.parse(rawRead) : []);
      setReadIds(read);

      fetch("/api/letters", { cache: "no-store" })
        .then(r => r.json())
        .then((data: { letters: Letter[] }) => {
          const loaded = data.letters ?? [];
          setLetters(loaded);

          if (savedUser) {
            const currentMe = titleCase(savedUser);
            const hasUnread = loaded.some(l => l.to === currentMe && !read.has(l.id));
            const alreadyNotified = sessionStorage.getItem(NOTIFY_KEY) === "1";
            if (hasUnread && !alreadyNotified) setNotifyOpen(true);
          }
        })
        .catch(() => setLetters([]));
    } catch {
      setLetters([]);
    }
  }, []);

  const refetch = async () => {
    try {
      const r = await fetch("/api/letters", { cache: "no-store" });
      const data = (await r.json()) as { letters: Letter[] };
      setLetters(data.letters ?? []);
    } catch {}
  };

  const saveRead = (next: Set<string>) => {
    setReadIds(next);
    try { localStorage.setItem(READ_KEY, JSON.stringify([...next])); } catch {}
  };

  const markRead = (id: string) => {
    if (readIds.has(id)) return;
    const next = new Set(readIds);
    next.add(id);
    saveRead(next);
  };

  const openLetter = (l: Letter) => {
    markRead(l.id);
    setActive(l);
  };

  const submit = async () => {
    if (!me || !message.trim()) return;
    if (editingId) {
      await fetch("/api/letters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, message: message.trim() }),
      });
      setEditingId(null);
    } else {
      const letter: Letter = {
        id:      "",
        from:    me,
        to:      other(me),
        message: message.trim(),
        date:    new Date().toISOString().slice(0, 10),
        color:   AUTHOR_COLORS[me],
      };
      await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letter),
      });
    }
    await refetch();
    setMessage("");
    setWriting(false);
  };

  const startEdit = (l: Letter) => {
    setMessage(l.message);
    setEditingId(l.id);
    setActive(null);
    setWriting(true);
  };

  const cancelWrite = () => {
    setWriting(false);
    setMessage("");
    setEditingId(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Энэ захиаг устгах уу?")) return;
    await fetch(`/api/letters?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await refetch();
    setActive(null);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem("music-choice");
      sessionStorage.removeItem(NOTIFY_KEY);
    } catch {}
    window.location.reload();
  };

  if (!me) {
    return (
      <section id="letters">
        <div className="reveal">
          <p className="section-label">Үгс</p>
          <h2 className="section-title">Ачаалж байна…</h2>
        </div>
      </section>
    );
  }

  /* Ирсэн захиа — надад хаягласан */
  const inbox = letters.filter(l => l.to === me);
  /* Илгээсэн захиа — би бичсэн */
  const sent  = letters.filter(l => l.from === me);
  /* Уншаагүй ирсэн захиа */
  const unread = inbox.filter(l => !readIds.has(l.id));
  const notifyLetter = unread[0] ?? null;

  const resetDodge = () => {
    setDodgeX({ x: 0, y: 0 });
    setDodgeLater({ x: 0, y: 0 });
  };

  const dismissNotify = () => {
    try { sessionStorage.setItem(NOTIFY_KEY, "1"); } catch {}
    setNotifyOpen(false);
    resetDodge();
  };

  /* Sakura — зөвхөн тухайн товч нь зугтана, бусад нь хэвээрээ */
  const dodgeFor = (which: "x" | "later") => {
    if (me !== "Sakura") return;
    const maxX = Math.min(window.innerWidth  / 2 - 80, 520);
    const maxY = Math.min(window.innerHeight / 2 - 80, 360);
    const rand = (max: number) => {
      const sign = Math.random() < 0.5 ? -1 : 1;
      return sign * (180 + Math.random() * (max - 180));
    };
    const pos = { x: rand(maxX), y: rand(maxY) };
    if (which === "x") setDodgeX(pos);
    else               setDodgeLater(pos);
  };

  const openFromNotify = () => {
    if (notifyLetter) {
      markRead(notifyLetter.id);
      setActive(notifyLetter);
    }
    try { sessionStorage.setItem(NOTIFY_KEY, "1"); } catch {}
    resetDodge();
    setNotifyOpen(false);
  };

  return (
    <section id="letters">
      {/* ── Шинэ захианы toast мэдэгдэл ── */}
      {notifyOpen && notifyLetter && (
        <div className="notify-overlay" onClick={dismissNotify}>
          <div className="notify-card" onClick={e => e.stopPropagation()}>
            <button
              className="notify-x"
              onClick={dismissNotify}
              onMouseEnter={() => dodgeFor("x")}
              onFocus={() => dodgeFor("x")}
              aria-label="Хаах"
              style={{
                transform: `translate(${dodgeX.x}px, ${dodgeX.y}px)`,
                transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              ✕
            </button>

            <p className="notify-label">✉ Шинэ захиа ✉</p>
            <h2 className="notify-title">{notifyLetter.from}-гаас чамд захиа ирлээ!</h2>
            <p className="notify-desc">Дараад нээж уншаарай ↓</p>

            <button
              className="notify-env"
              style={{ ["--env" as string]: notifyLetter.color }}
              onClick={openFromNotify}
              aria-label="Захиа нээх"
            >
              <div className="notify-env-body">
                <div className="notify-env-flap" />
                <div className="notify-env-seal">✿</div>
                <div className="notify-env-shine" />
              </div>
              <span className="notify-env-hint">дарж нээх ↑</span>
            </button>

            <button
              className="btn btn-outline notify-later"
              onClick={dismissNotify}
              onMouseEnter={() => dodgeFor("later")}
              onFocus={() => dodgeFor("later")}
              style={{
                transform: `translate(${dodgeLater.x}px, ${dodgeLater.y}px)`,
                transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Дараа унших
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="section-label">Үгс</p>
        <h2 className="section-title">Сайн уу, {me} ✿</h2>
        <p className="section-desc">
          Эндээс {other(me)}-гаас чамд ирсэн захиануудаа уншиж, өөрөө ч гэсэн захиа бичиж болно. Сэтгэлээ уудалж, бие биеэ хөхиүлэн дэмжицгээе. ✉
        </p>
        <div className="letter-actions">
          <button className="btn btn-primary letter-write-btn" onClick={() => setWriting(true)}>
            ✎ {other(me)}-д захиа бичих
          </button>
          <button className="letter-logout" onClick={logout}>
            {me}-аас гарах →
          </button>
        </div>
      </div>

      {/* ── Inbox — ирсэн захиа ── */}
      <h3 className="letter-heading">📬 Ирсэн захиа ({inbox.length})</h3>
      {inbox.length === 0 ? (
        <div className="letter-empty">
          <span className="letter-empty-ic">📭</span>
          <p>Одоогоор {other(me)}-гаас захиа ирээгүй байна</p>
        </div>
      ) : (
        <div className="letters-grid">
          {inbox.map(l => (
            <button
              key={l.id}
              className={`envelope envelope--unread${readIds.has(l.id) ? "" : " envelope--new"}`}
              style={{ ["--env" as string]: l.color }}
              onClick={() => openLetter(l)}
              aria-label={`${l.from}-н захиа`}
            >
              <div className="envelope-body">
                <div className="envelope-flap" />
                <div className="envelope-stamp">✿</div>
                <div className="envelope-addr">
                  <span className="envelope-to">— {l.to} —</span>
                  <span className="envelope-from">{l.from}-аас</span>
                  <span className="envelope-date">{l.date}</span>
                </div>
                <span className="envelope-dot" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Sent — илгээсэн захиа ── */}
      {sent.length > 0 && (
        <>
          <h3 className="letter-heading letter-heading--sent">✉ Илгээсэн захиа ({sent.length})</h3>
          <div className="letters-grid">
            {sent.map(l => (
              <button
                key={l.id}
                className="envelope envelope--sent"
                style={{ ["--env" as string]: l.color }}
                onClick={() => setActive(l)}
                aria-label={`${l.to}-д илгээсэн захиа`}
              >
                <div className="envelope-body">
                  <div className="envelope-flap" />
                  <div className="envelope-stamp">✿</div>
                  <div className="envelope-addr">
                    <span className="envelope-to">— {l.to} —</span>
                    <span className="envelope-from">{l.from}-аас</span>
                    <span className="envelope-date">{l.date}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Reading modal ── */}
      {active && (
        <div className="letter-modal" onClick={() => setActive(null)}>
          <div
            className="letter-stage"
            onClick={e => e.stopPropagation()}
            style={{ ["--env" as string]: active.color }}
          >
            {/* Big animated envelope */}
            <div className="stage-env" aria-hidden="true">
              <div className="stage-env-body" />
              <div className="stage-env-flap" />
              <div className="stage-env-seal">✿</div>
            </div>

            {/* Letter paper that rises from envelope */}
            <div className="letter-paper letter-paper--staged">
              <div className="letter-paper-top">
                <span className="letter-paper-from">— {active.from}-аас —</span>
                <span className="letter-paper-date">{active.date}</span>
              </div>
              <h3 className="letter-paper-to">Хайрт {active.to}</h3>
              <p className="letter-paper-msg">{active.message}</p>
              <p className="letter-paper-sign">хайртай, {active.from} ✿</p>

              <button className="letter-close" onClick={() => setActive(null)}>✕</button>
              {active.from === me && (
                <div className="letter-owner-actions">
                  <button className="letter-edit" onClick={() => startEdit(active)}>
                    ✎ засах
                  </button>
                  <button className="letter-delete" onClick={() => remove(active.id)}>
                    🗑 устгах
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Write modal ── */}
      {writing && (
        <div className="letter-modal" onClick={cancelWrite}>
          <div className="letter-form" onClick={e => e.stopPropagation()}>
            <h3>{editingId ? "Захиа засах ✎" : "Шинэ захиа ✎"}</h3>

            <div className="letter-who">
              <span className="letter-who-label">Хэнээс:</span>
              <span
                className="letter-who-btn letter-who-btn--active"
                style={{ ["--env" as string]: AUTHOR_COLORS[me] }}
              >
                {me}
              </span>
              <span className="letter-who-arrow">→</span>
              <span className="letter-who-to">{other(me)}-д</span>
            </div>

            <textarea
              placeholder="Сэтгэлээ уудлаарай..."
              rows={6}
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={1000}
              autoFocus
            />
            <div className="letter-form-btns">
              <button className="btn btn-outline" onClick={cancelWrite}>Болих</button>
              <button className="btn btn-primary" onClick={submit}>
                {editingId ? "Хадгалах ✓" : "Илгээх ✉"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
