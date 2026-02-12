import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";

export async function POST(req: Request) {
  try {
    const body = await req.json();


    // Validasi minimal
    if (!body.user_id || !body.answers || !body.category_id) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.insert(jawaban).values({
      user_id: body.user_id,
      answers: body.answers,
      category_id: body.category_id,
      // created_at otomatis dari defaultNow
    }).returning();

    return NextResponse.json({ status: "success", data: result[0] });

  } catch (err) {
    console.error("Insert error:", err); // ← ini dia!
    return NextResponse.json(
      { status: "error", message: (err as Error).message },
      { status: 500 }
    );
  }
}
