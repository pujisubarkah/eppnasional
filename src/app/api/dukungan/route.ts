import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        jawabanId: jawaban.id,
        userId: jawaban.user_id,
        answers: jawaban.answers,
        pelatihanId: pelatihan.id,
        namaPelatihan: pelatihan.nama,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 2)) // kategori untuk q1–q5
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id));

    const result = data.map((item) => {
      const answers = item.answers as Record<string, string>;
      return {
        jawabanId: item.jawabanId,
        userId: item.userId,
        pelatihanId: item.pelatihanId ?? null,
        namaPelatihan: item.namaPelatihan ?? "Tidak diketahui",
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
      };
    });

    // 💡 Inisialisasi frekuensi
    const frekuensi: Record<string, Record<string, number>> = {
      q1: {},
      q2: {},
      q3: {},
      q4: {},
      q5: {},
    };

    for (const entry of result) {
      for (let i = 1; i <= 5; i++) {
        const key = `q${i}` as keyof typeof entry;
        const jawaban = entry[key];

        if (jawaban) {
          if (!frekuensi[key][jawaban]) {
            frekuensi[key][jawaban] = 0;
          }
          frekuensi[key][jawaban]++;
        }
      }
    }

    return NextResponse.json({
      result,
      frekuensi,
    });

  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
