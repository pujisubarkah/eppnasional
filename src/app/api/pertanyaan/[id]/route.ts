export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions, question_options } from "@/db/pertanyaan";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ Await params karena sekarang Promise
  const awaitedParams = await params;
  const id = Number(awaitedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Ambil pertanyaan
  const question = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  if (!question.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Ambil opsi
  const options = await db
    .select()
    .from(question_options)
    .where(eq(question_options.question_id, id))
    .orderBy(question_options.ordering);

  return NextResponse.json({
    ...question[0],
    options,
  });
}