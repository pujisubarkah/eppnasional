// app/api/pertanyaan/[id]/[ordering]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions, question_options } from "@/db/pertanyaan";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      ordering: string;
    }>;
  }
) {
  const awaitedParams = await params;
  const id = Number(awaitedParams.id);
  const ordering = Number(awaitedParams.ordering);

  if (isNaN(id) || isNaN(ordering)) {
    return NextResponse.json(
      { error: "Invalid id or ordering" },
      { status: 400 }
    );
  }

  // Ambil pertanyaan
  const question = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);

  if (!question.length) {
    return NextResponse.json(
      { error: "Question not found" },
      { status: 404 }
    );
  }

  // Ambil opsi berdasarkan question_id DAN ordering
  const option = await db
    .select()
    .from(question_options)
    .where(
      and(
        eq(question_options.question_id, id),
        eq(question_options.ordering, ordering)
      )
    );

  if (!option.length) {
    return NextResponse.json(
      { error: "Option not found for this ordering" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    question: question[0],
    option,
  });
}
