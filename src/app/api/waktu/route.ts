import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db
      .select({
        id: jawaban.id,
        userId: jawaban.user_id,
        answers: jawaban.answers,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 4)); // ambil yang category_id = 4 saja

    const frequencyMap: Record<string, number> = {};

    for (const row of data) {
      const answers = row.answers as Record<string, string>;
      for (const value of Object.values(answers)) {
        if (value && value.trim()) {
          const clean = value.trim();
          frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
    
      data: frequencyMap,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: (error as Error).message,
    }, { status: 500 });
  }
}
