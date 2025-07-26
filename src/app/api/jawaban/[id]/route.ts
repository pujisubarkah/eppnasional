import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const categoryId = Number(params.id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category_id" }, { status: 400 });
  }

  try {
    const result = await db
      .select({
        jawabanId: jawaban.id,
        userId: jawaban.user_id,
        answers: jawaban.answers,
        pelatihanId: alumni.pelatihanId,
        namaPelatihan: pelatihan.nama, // ← ambil nama pelatihan
      })
      .from(jawaban)
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id)) // ← join ke pelatihan
      .where(eq(jawaban.category_id, categoryId));

    return NextResponse.json({ result });

  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
  }
}
