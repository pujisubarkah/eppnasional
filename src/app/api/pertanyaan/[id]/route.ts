export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions, question_options } from "@/db/pertanyaan";
import { sub_pertanyaan } from "@/db/sub_pertanyaan"; // pastikan ini benar
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const awaitedParams = await params;
  const id = Number(awaitedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const question = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  if (!question.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const options = await db
    .select()
    .from(question_options)
    .where(eq(question_options.question_id, id))
    .orderBy(question_options.ordering);

  // 🔄 Loop untuk ambil sub_pertanyaan per option
  const optionsWithSub = await Promise.all(
    options.map(async (option) => {
      const subs = await db
        .select()
        .from(sub_pertanyaan)
        .where(eq(sub_pertanyaan.questionOptionId, option.id));

      return {
        ...option,
        sub_pertanyaan: subs,
      };
    })
  );

  return NextResponse.json({
    ...question[0],
    options: optionsWithSub,
  });
}
