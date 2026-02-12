import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db
      .select({
        id: jawaban.id,
        userId: jawaban.user_id,
        answers: jawaban.answers,
        pelatihanId: pelatihan.id,
        namaPelatihan: pelatihan.nama,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 4))
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id));

    // Group by pelatihan
    const pelatihanMap: Record<string, { pelatihanId: number | null, namaPelatihan: string | null, data: Record<string, number> }> = {};
    for (const row of data) {
      const answers = row.answers as Record<string, string>;
      const pelKey = String(row.pelatihanId ?? 'null');
      if (!pelatihanMap[pelKey]) {
        pelatihanMap[pelKey] = {
          pelatihanId: row.pelatihanId ?? null,
          namaPelatihan: row.namaPelatihan ?? null,
          data: {},
        };
      }
      for (const value of Object.values(answers)) {
        if (value && value.trim()) {
          const clean = value.trim();
          pelatihanMap[pelKey].data[clean] = (pelatihanMap[pelKey].data[clean] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      data: Object.values(pelatihanMap),
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: (error as Error).message,
    }, { status: 500 });
  }
}
