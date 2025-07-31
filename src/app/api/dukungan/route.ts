import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";

import { eq } from "drizzle-orm";
import { pelatihan } from "@/db/pelatihan";

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

    // Group answers by question and pelatihan
    const pertanyaanMap = {
      q1: "Atasan memberikan respon positif atas penerapan pengetahuan dan keterampilan baru yang diperoleh dari hasil Pelatihan",
      q2: "Atasan memberi dukungan dalam keberlanjutan Proyek Perubahan",
      q3: "Pelatihan ini meningkatkan kepercayaan atasan kepada saya untuk menangani tugas yang lebih menantang",
      q4: "Atasan memberikan penilaian positif terhadap perubahan perilaku setelah pelatihan",
      q5: "Rekan kerja memberikan penilaian positif terhadap perubahan perilaku setelah pelatihan",
    };

    // Group by question and pelatihan
    const grouped: Record<string, Record<string, { pelatihanId: number | null, namaPelatihan: string | null, answers: Array<{ answer: string | null }> }>> = {};
    for (const key of Object.keys(pertanyaanMap)) {
      grouped[key] = {};
    }
    for (const item of data) {
      const answers = item.answers as Record<string, string>;
      for (const key of Object.keys(pertanyaanMap)) {
        const pelatihanId = item.pelatihanId ?? null;
        const namaPelatihan = item.namaPelatihan ?? null;
        const pelKey = pelatihanId ? String(pelatihanId) : "null";
        if (!grouped[key][pelKey]) {
          grouped[key][pelKey] = {
            pelatihanId,
            namaPelatihan,
            answers: [],
          };
        }
        grouped[key][pelKey].answers.push({ answer: answers[key] || null });
      }
    }

    // Calculate frekuensi per question per pelatihan
    const frekuensi: Record<string, Array<{ pelatihanId: number | null, namaPelatihan: string | null, frekuensi: Record<string, number> }>> = {};
    for (let i = 1; i <= 5; i++) {
      const key = `q${i}`;
      frekuensi[key] = [];
      for (const pelKey of Object.keys(grouped[key])) {
        const { pelatihanId, namaPelatihan, answers } = grouped[key][pelKey];
        const freq: Record<string, number> = {};
        for (const entry of answers) {
          const jawaban = entry.answer;
          if (jawaban) {
            if (!freq[jawaban]) freq[jawaban] = 0;
            freq[jawaban]++;
          }
        }
        frekuensi[key].push({ pelatihanId, namaPelatihan, frekuensi: freq });
      }
    }

    // Map frekuensi keys to question text
    const frekuensiWithQuestion: Record<string, Array<{ pelatihanId: number | null, namaPelatihan: string | null, frekuensi: Record<string, number> }>> = {};
    for (let i = 1; i <= 5; i++) {
      const key = `q${i}`;
      const question = pertanyaanMap[key as keyof typeof pertanyaanMap];
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
