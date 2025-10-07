import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { lemdik as masterLemdik } from '@/db/master_lemdik';
import { eq, sql, and, inArray } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_sipka: string }> }
) {
  try {
    const { id_sipka } = await params;

    // Validasi ID SIPKA
    if (!id_sipka) {
      return NextResponse.json(
        { success: false, message: "ID SIPKA tidak ditemukan" },
        { status: 400 }
      );
    }

    // Convert string id_sipka to number
    const numericIdSipka = parseInt(id_sipka);
    if (isNaN(numericIdSipka)) {
      return NextResponse.json(
        { success: false, message: "ID SIPKA harus berupa angka" },
        { status: 400 }
      );
    }

    // 1. Ambil alumni berdasarkan ID SIPKA dari master_lemdik
    const alumniResult = await db
      .select({
        id: alumni.id,
        namaAlumni: alumni.namaAlumni,
        lemdik: alumni.lemdik,
        pelatihanId: alumni.pelatihanId,
        idSipka: masterLemdik.idsipka,
        namaLemdik: masterLemdik.namalemdik,
        uuid: masterLemdik.uuid,
        provinsi: masterLemdik.provinsi,
        instansi: masterLemdik.instansi,
      })
      .from(alumni)
      .innerJoin(
        masterLemdik,
        sql`LOWER(TRIM(${alumni.lemdik})) = LOWER(TRIM(${masterLemdik.namalemdik}))`
      )
      .where(eq(masterLemdik.idsipka, numericIdSipka));

    // Cek apakah alumni ditemukan
    if (alumniResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada alumni dengan ID SIPKA tersebut" },
        { status: 404 }
      );
    }

    // 2. Ambil IDs alumni untuk query jawaban
    const alumniIds = alumniResult.map((a) => a.id);

    // 3. Ambil data jawaban materi (category_id = 1) dari alumni tersebut
    const jawabanData = await db
      .select({
        jawabanId: jawaban.id,
        userId: jawaban.user_id,
        answers: jawaban.answers,
        pelatihanId: pelatihan.id,
        namaPelatihan: pelatihan.nama,
      })
      .from(jawaban)
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id))
      .where(
        and(
          eq(jawaban.category_id, 1), // Category materi
          inArray(jawaban.user_id, alumniIds)
        )
      );

    // 4. Transform data jawaban
    const materiResult = jawabanData.map((item) => {
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

    // 5. Hitung frekuensi global dan per pelatihan
    const freqMap = {
      relevan: {} as Record<string, number>,
      tidakRelevan: {} as Record<string, number>,
    };

    const freqPerPelatihan: Record<number, {
      namaPelatihan: string;
      relevan: Record<string, number>;
      tidakRelevan: Record<string, number>;
    }> = {};

    for (const entry of materiResult) {
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

      // Hitung frekuensi relevan
      Object.values(entry.relevan).forEach((val) => {
        if (val) {
          freqMap.relevan[val] = (freqMap.relevan[val] || 0) + 1;
          freqPerPelatihan[pelatihanId].relevan[val] =
            (freqPerPelatihan[pelatihanId].relevan[val] || 0) + 1;
        }
      });

      // Hitung frekuensi tidak relevan
      Object.values(entry.tidakRelevan).forEach((val) => {
        if (val) {
          freqMap.tidakRelevan[val] = (freqMap.tidakRelevan[val] || 0) + 1;
          freqPerPelatihan[pelatihanId].tidakRelevan[val] =
            (freqPerPelatihan[pelatihanId].tidakRelevan[val] || 0) + 1;
        }
      });
    }

    // 6. Return response hanya data materi
    return NextResponse.json({
      success: true,
      idSipka: numericIdSipka,
      result: materiResult,
      frekuensi: freqMap,
      frekuensiPerPelatihan: freqPerPelatihan,
    });

  } catch (error) {
    console.error("Error fetching materi by ID SIPKA:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data materi", error: errorMessage },
      { status: 500 }
    );
  }
}
