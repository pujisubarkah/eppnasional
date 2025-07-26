import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";

import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        jawabanId: jawaban.id,
        userId: jawaban.user_id,
        answers: jawaban.answers,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 2)) // kategori untuk q1–q5
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id));

    const pertanyaanMap = {
      q1: "Atasan memberikan respon positif atas penerapan pengetahuan dan keterampilan baru yang diperoleh dari hasil Pelatihan",
      q2: "Atasan memberi dukungan dalam keberlanjutan Proyek Perubahan",
      q3: "Pelatihan ini meningkatkan kepercayaan atasan kepada saya untuk menangani tugas yang lebih menantang",
      q4: "Atasan memberikan penilaian positif terhadap perubahan perilaku setelah pelatihan",
      q5: "Rekan kerja memberikan penilaian positif terhadap perubahan perilaku setelah pelatihan",
    };

    // Group answers by question (q1–q5)
    const grouped: Record<string, Array<{ answer: string | null }>> = {
      q1: [],
      q2: [],
      q3: [],
      q4: [],
      q5: [],
    };

    for (const item of data) {
      const answers = item.answers as Record<string, string>;
      for (const key of Object.keys(pertanyaanMap)) {
        grouped[key].push({ answer: answers[key] || null });
      }
    }

    // Inisialisasi frekuensi
    const frekuensi: Record<string, Record<string, number>> = {
      q1: {},
      q2: {},
      q3: {},
      q4: {},
      q5: {},
    };

    for (let i = 1; i <= 5; i++) {
      const key = `q${i}` as keyof typeof pertanyaanMap;
      for (const entry of grouped[key]) {
        const jawaban = entry.answer;
        if (jawaban) {
          if (!frekuensi[key][jawaban]) {
            frekuensi[key][jawaban] = 0;
          }
          frekuensi[key][jawaban]++;
        }
      }
    }

    // Map frekuensi keys to question text
    const frekuensiWithQuestion: Record<string, Record<string, number>> = {};
    for (let i = 1; i <= 5; i++) {
      const key = `q${i}` as keyof typeof pertanyaanMap;
      const question = pertanyaanMap[key];
      frekuensiWithQuestion[question] = frekuensi[key];
    }

    return NextResponse.json({
      frekuensi: frekuensiWithQuestion,
    });

  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
