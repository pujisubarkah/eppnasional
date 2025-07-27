import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { eq } from "drizzle-orm";

// Mapping q ke pertanyaan
const mapping: Record<string, string> = {
  q1: "Terdapat peningkatan dalam sikap dan perilaku kerja Alumni setelah mengikuti pelatihan",
  q2: "Terdapat peningkatan kompetensi alumni yang mendukung kinerjanya",
  q3: "Penerapan hasil pelatihan Alumni mendorong terjadinya perubahan dan perbaikan dalam proses kerja organisasi",
  q4: "Waktu yang dihabiskan Alumni untuk mengikuti pelatihan sepadan dengan manfaat atau perkembangan yang diperoleh setelah mengikuti pelatihan",
};

export async function GET() {
  try {
    const result = await db
      .select({
        id: jawaban.id,
        user_id: jawaban.user_id,
        created_at: jawaban.created_at,
        answers: jawaban.answers,
        category_id: jawaban.category_id,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 6));

    // Inisialisasi frekuensi pakai teks pertanyaan
    const frekuensi: Record<string, Record<string, number>> = {};

    for (const row of result) {
      const answers = row.answers as Record<string, string>;

      for (let i = 1; i <= 4; i++) {
        const key = `q${i}`;
        const jawaban = answers[key];

        if (jawaban && mapping[key]) {
          const pertanyaan = mapping[key];

          if (!frekuensi[pertanyaan]) {
            frekuensi[pertanyaan] = {};
          }

          if (!frekuensi[pertanyaan][jawaban]) {
            frekuensi[pertanyaan][jawaban] = 0;
          }

          frekuensi[pertanyaan][jawaban]++;
        }
      }
    }

    return NextResponse.json({ result, frekuensi });
  } catch (error) {
    console.error("Error fetching peer review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
