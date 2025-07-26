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
      .where(eq(jawaban.category_id, 1))
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id));

    const result = data.map((item) => {
      const answers = item.answers as Record<string, string>;

      const relevan = {
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
      };

      const tidakRelevan = {
        q4: answers.q4,
        q5: answers.q5,
        q6: answers.q6,
      };

      return {
        jawabanId: item.jawabanId,
        userId: item.userId,
        pelatihanId: item.pelatihanId ?? null,
        namaPelatihan: item.namaPelatihan ?? "Tidak diketahui",
        relevan,
        tidakRelevan,
      };
    });

    // Frekuensi global
    const freqMap = {
      relevan: {} as Record<string, number>,
      tidakRelevan: {} as Record<string, number>,
    };

    // Frekuensi per pelatihan
    const freqPerPelatihan: Record<number, {
      namaPelatihan: string;
      relevan: Record<string, number>;
      tidakRelevan: Record<string, number>;
    }> = {};

    for (const entry of result) {
      const pelatihanId = entry.pelatihanId ?? 0;
      const namaPelatihan = entry.namaPelatihan ?? "Tidak diketahui";

      // Init per pelatihan jika belum ada
      if (!freqPerPelatihan[pelatihanId]) {
        freqPerPelatihan[pelatihanId] = {
          namaPelatihan,
          relevan: {},
          tidakRelevan: {},
        };
      }

      Object.values(entry.relevan).forEach((val) => {
        if (val) {
          freqMap.relevan[val] = (freqMap.relevan[val] || 0) + 1;
          freqPerPelatihan[pelatihanId].relevan[val] =
            (freqPerPelatihan[pelatihanId].relevan[val] || 0) + 1;
        }
      });

      Object.values(entry.tidakRelevan).forEach((val) => {
        if (val) {
          freqMap.tidakRelevan[val] = (freqMap.tidakRelevan[val] || 0) + 1;
          freqPerPelatihan[pelatihanId].tidakRelevan[val] =
            (freqPerPelatihan[pelatihanId].tidakRelevan[val] || 0) + 1;
        }
      });
    }

    return NextResponse.json({
      result,
      frekuensi: freqMap,
      frekuensiPerPelatihan: freqPerPelatihan,
    });

  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
