import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
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
        pelatihanId: pelatihan.id,
        namaPelatihan: pelatihan.nama,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 6))
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id));

    // Group frekuensi by pelatihan
    const pelatihanMap: Record<string, { pelatihanId: number | null, namaPelatihan: string | null, frekuensi: Record<string, Record<string, number>> }> = {};
    for (const row of result) {
      const answers = row.answers as Record<string, string>;
      const pelKey = String(row.pelatihanId ?? 'null');
      if (!pelatihanMap[pelKey]) {
        pelatihanMap[pelKey] = {
          pelatihanId: row.pelatihanId ?? null,
          namaPelatihan: row.namaPelatihan ?? null,
          frekuensi: {},
        };
      }
      for (let i = 1; i <= 4; i++) {
        const key = `q${i}`;
        const jawaban = answers[key];
        if (jawaban && mapping[key]) {
          const pertanyaan = mapping[key];
          if (!pelatihanMap[pelKey].frekuensi[pertanyaan]) {
            pelatihanMap[pelKey].frekuensi[pertanyaan] = {};
          }
          if (!pelatihanMap[pelKey].frekuensi[pertanyaan][jawaban]) {
            pelatihanMap[pelKey].frekuensi[pertanyaan][jawaban] = 0;
          }
          pelatihanMap[pelKey].frekuensi[pertanyaan][jawaban]++;
        }
      }
    }

    return NextResponse.json({
      data: Object.values(pelatihanMap),
    });
  } catch (error) {
    console.error("Error fetching peer review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
