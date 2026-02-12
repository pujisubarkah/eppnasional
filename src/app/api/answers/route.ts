import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { answers } from "@/db/answers";

// GET: Ambil semua jawaban
export async function GET() {
  try {
    const result = await db.select().from(answers);
    return NextResponse.json({ status: "success", data: result });
  } catch {
    return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
  }
}

// POST: Simpan jawaban baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question_id, user_id, answer } = body;

    if (!question_id || !user_id || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await db
      .insert(answers)
      .values({
        question_id,
        user_id,
        answer,
        created_at: new Date(),
      })
      .returning();

    return NextResponse.json({ status: "success", data: result[0] });
  } catch {
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}