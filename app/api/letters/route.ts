import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const KEY = "sakura:letters";

export type Author = "Sasuke" | "Sakura";
export type Letter = {
  id:      string;
  from:    Author;
  to:      Author;
  message: string;
  date:    string;
  color:   string;
};

export const dynamic = "force-dynamic";

/* GET — бүх захиаг буцаах */
export async function GET() {
  try {
    const letters = (await redis.get<Letter[]>(KEY)) ?? [];
    return NextResponse.json({ letters });
  } catch (e) {
    return NextResponse.json({ letters: [], error: String(e) }, { status: 500 });
  }
}

/* POST — шинэ захиа үүсгэх */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Letter;
    if (!body?.message?.trim() || !body.from || !body.to) {
      return NextResponse.json({ error: "Invalid letter" }, { status: 400 });
    }
    const letters = (await redis.get<Letter[]>(KEY)) ?? [];
    const letter: Letter = { ...body, id: `${Date.now()}` };
    const next = [letter, ...letters];
    await redis.set(KEY, next);
    return NextResponse.json({ letter });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/* PATCH — захиа засварлах */
export async function PATCH(req: Request) {
  try {
    const { id, message } = (await req.json()) as { id: string; message: string };
    const letters = (await redis.get<Letter[]>(KEY)) ?? [];
    const next = letters.map(l => (l.id === id ? { ...l, message } : l));
    await redis.set(KEY, next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/* DELETE — захиа устгах */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const letters = (await redis.get<Letter[]>(KEY)) ?? [];
    const next = letters.filter(l => l.id !== id);
    await redis.set(KEY, next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
