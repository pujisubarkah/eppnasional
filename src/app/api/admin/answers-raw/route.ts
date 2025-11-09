import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { eq, sql } from "drizzle-orm";

const toArraySafe = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const coalesceNumber = (...values: unknown[]): number | null => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const coerced = Number(value);
    if (!Number.isNaN(coerced)) return coerced;
  }
  return null;
};

const coalesceString = (...values: unknown[]): string => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    return String(value);
  }
  return "";
};

const normalizeAnswers = (rawValue: unknown): Record<string, string> => {
  try {
    if (!rawValue) return {};
    let source: Record<string, unknown> | null = null;

    if (typeof rawValue === "string") {
      const parsed = JSON.parse(rawValue);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        source = parsed as Record<string, unknown>;
      }
    } else if (typeof rawValue === "object" && !Array.isArray(rawValue)) {
      source = rawValue as Record<string, unknown>;
    }

    if (!source) return {};
    const result: Record<string, string> = {};
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      const value = source[key];
      result[String(key)] = value == null ? "" : String(value);
    }
    return result;
  } catch {
    return {};
  }
};

export async function GET() {
  try {
    const rawAnswers = await db
      .select({
        id: jawaban.id,
        user_id: jawaban.user_id,
        category_id: jawaban.category_id,
        answers: jawaban.answers,
        created_at: jawaban.created_at,
        userName: alumni.namaAlumni,
        userNip: alumni.nipNrpNik,
        userPhone: (alumni as unknown as any).telepon,
        userInstansiId: alumni.instansiId,
        userInstansiKategoriId: alumni.instansiKategoriId,
        userTahunPelatihanId: alumni.tahunPelatihanId,
        userPelatihanId: alumni.pelatihanId,
        userDomisiliId: alumni.domisiliId,
        userJabatanId: alumni.jabatanId,
        userLemdik: alumni.lemdik,
      })
      .from(jawaban)
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id));

    const categoryRows = toArraySafe<Record<string, unknown>>(
      (await db.execute(sql`select id, name from eppn.categories`)).rows
    );
    const categoryMap = new Map<number, string>();
    for (const row of categoryRows) {
      if (!row) continue;
      const id = coalesceNumber(row.id, row.category_id, row.categoryId);
      if (id === null) continue;
      categoryMap.set(id, coalesceString(row.name));
    }

    const instansiRows = toArraySafe<Record<string, unknown>>(
      (await db.execute(sql`select * from eppn.instansi`)).rows
    );
    const instansiMap = new Map<number, string>();
    for (const row of instansiRows) {
      if (!row) continue;
      const id = coalesceNumber(row.id, row.instansi_id, row.instansiId);
      if (id === null) continue;
      instansiMap.set(id, coalesceString(row.agency_name, row.nama_instansi));
    }

    const jabatanRows = toArraySafe<Record<string, unknown>>(
      (await db.execute(sql`select * from eppn.jabatan`)).rows
    );
    const jabatanMap = new Map<number, string>();
    for (const row of jabatanRows) {
      if (!row) continue;
      const id = coalesceNumber(row.id, row.jabatan_id, row.jabatanId);
      if (id === null) continue;
      jabatanMap.set(id, coalesceString(row.nama_jabatan, row.nama));
    }

    const questionRows = toArraySafe<Record<string, unknown>>(
      (await db.execute(sql`select * from eppn.question_options`)).rows
    );
    const questionsByCategory = new Map<number, Array<{ question_key: string; question_text: string }>>();
    for (const row of questionRows) {
      if (!row) continue;
      const categoryId = coalesceNumber(
        row.category_id,
        row.categoryId,
        row.kategori_id,
        row.kategoriId,
        row.category,
        row.categoryid
      );
      if (categoryId === null) continue;

      const questionKey = coalesceString(row.question_key, row.questionKey, row.kode, row.key);
      if (!questionKey) continue;

      const questionText = coalesceString(row.question_text, row.questionText, row.pertanyaan, row.text);
      const bucket = questionsByCategory.get(categoryId) ?? [];
      bucket.push({ question_key: questionKey, question_text: questionText });
      questionsByCategory.set(categoryId, bucket);
    }

    const transformedData: Array<{
      id: number;
      user_id: number;
      created_at: Date | string | null;
      answers: Record<string, string>;
      category_id: number;
      user: {
        name: string;
        email: string;
        nip: string;
        telepon: string;
        instansi: string;
        instansi_id: number | null;
        instansi_kategori_id: number | null;
        tahun_pelatihan_id: number | null;
        pelatihan_id: number | null;
        domisili_id: number | null;
        lemdik: string;
        jabatan: string;
      };
      category: { name: string };
      questions: Array<{ question_key: string; question_text: string }>;
    }> = [];

    for (const row of toArraySafe<Record<string, unknown>>(rawAnswers)) {
      if (!row) continue;
      try {
        const instansiId = coalesceNumber(
          (row as any).userInstansiId,
          (row as any).user_instansi_id,
          (row as any).instansiId,
          (row as any).instansi_id
        );
        const instansiKategoriId = coalesceNumber(
          (row as any).userInstansiKategoriId,
          (row as any).user_instansi_kategori_id,
          (row as any).instansiKategoriId,
          (row as any).instansi_kategori_id
        );
        const tahunPelatihanId = coalesceNumber(
          (row as any).userTahunPelatihanId,
          (row as any).user_tahun_pelatihan_id,
          (row as any).tahunPelatihanId,
          (row as any).tahun_pelatihan_id
        );
        const pelatihanId = coalesceNumber(
          (row as any).userPelatihanId,
          (row as any).user_pelatihan_id,
          (row as any).pelatihanId,
          (row as any).pelatihan_id
        );
        const domisiliId = coalesceNumber(
          (row as any).userDomisiliId,
          (row as any).user_domisili_id,
          (row as any).domisiliId,
          (row as any).domisili_id
        );
        const jabatanId = coalesceNumber(
          (row as any).userJabatanId,
          (row as any).jabatanId,
          (row as any).jabatan_id
        );
        const categoryId = coalesceNumber(row.category_id, (row as any).categoryId) ?? 0;

        transformedData.push({
          id: Number(row.id ?? 0),
          user_id: Number(row.user_id ?? 0),
          created_at: (row as any).created_at ?? "",
          answers: normalizeAnswers((row as any).answers),
          category_id: categoryId,
          user: {
            name: coalesceString((row as any).userName, (row as any).nama_alumni),
            email: "",
            nip: coalesceString((row as any).userNip, (row as any).nip_nrp_nik),
            telepon: coalesceString((row as any).userPhone, (row as any).telepon),
            instansi: instansiId !== null ? instansiMap.get(instansiId) ?? String(instansiId) : "",
            instansi_id: instansiId,
            instansi_kategori_id: instansiKategoriId,
            tahun_pelatihan_id: tahunPelatihanId,
            pelatihan_id: pelatihanId,
            domisili_id: domisiliId,
            lemdik: coalesceString((row as any).userLemdik, (row as any).lemdik, (row as any).user_lemdik),
            jabatan: jabatanId !== null ? jabatanMap.get(jabatanId) ?? String(jabatanId) : "",
          },
          category: {
            name: categoryMap.get(categoryId) ?? "",
          },
          questions: questionsByCategory.get(categoryId) ?? [],
        });
      } catch (rowError) {
        console.error("Skipping malformed answer row:", row, rowError);
      }
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
    });
  } catch (error) {
    console.error("Error fetching answers raw data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
