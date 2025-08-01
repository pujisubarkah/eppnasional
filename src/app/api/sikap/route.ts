import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";

// Keyword mapping untuk masing-masing kategori
const mapping = {
  sikapData: {
    "Motivasi Etika & Integritas": ["etika", "integritas", "motivasi"],
    "Percaya Diri Kebijakan": ["percaya diri", "kepemimpinan"],
    "Inovasi/Kreativitas": ["inovasi", "kreativitas"],
    "Kepemimpinan Kolaboratif": ["kolaboratif", "stakeholders"],
    "Peningkatan Kinerja": ["kinerja"],
  },
  kinerjaData: {
    "Kinerja Individu": ["kinerja individu"],
    "Pengetahuan & Keterampilan": ["pengetahuan", "keterampilan"],
    "Mengelola Perubahan": ["mengelola perubahan"],
    "Kualitas Pelayanan Publik": ["pelayanan publik"],
    "Menggerakkan Stakeholders": ["stakeholders"],
    "Jejaring Kerja": ["jejaring"],
    "Kepuasan Pelanggan": ["pelanggan"],
  },
  ekonomiData: {
    "< 50 Juta": ["< 50", "kurang dari rp 50"],
    "50 Juta - 100 Juta": ["100 juta", "rp.100.000.000"],
    "100 Juta - 500 Juta": ["500 juta"],
    "> 500 Juta": ["lebih dari rp 10", "> 500"],
  },
  temaData: {
    "Pengentasan Kemiskinan": ["kemiskinan"],
    "Peningkatan Investasi": ["investasi"],
    "Digitalisasi Administrasi": ["digital"],
    "Prioritas Presiden": ["presiden"],
    "Other": [],
  },
  transformasiData: {
    "Sosial": ["sosial"],
    "Ekonomi": ["ekonomi"],
    "Tata Kelola": ["tata kelola", "regulasi"],
  },
};

// Fungsi pemetaan kalimat ke kategori

// Fungsi pemetaan kalimat ke kategori per pelatihan, hasil: array per pelatihan
function mapKalimatToKategoriPerPelatihanArray(frekuensiKalimat: Array<{ kalimat: string, count: number, pelatihanId: number|null, namaPelatihan: string|null }>) {
  // { [pelatihanId]: { namaPelatihan, ...kategoriData } }
  type KategoriGroup = Record<string, number>;
  type GroupKey = "sikapData" | "kinerjaData" | "ekonomiData" | "temaData" | "transformasiData";
  type PelatihanResult = {
    pelatihanId: number | null;
    namaPelatihan: string | null;
    sikapData: KategoriGroup;
    kinerjaData: KategoriGroup;
    ekonomiData: KategoriGroup;
    temaData: KategoriGroup;
    transformasiData: KategoriGroup;
  };
  const result: Record<number | string, PelatihanResult> = {};

  for (const { kalimat, count, pelatihanId, namaPelatihan } of frekuensiKalimat) {
    const key = pelatihanId ?? 'null';
    if (!result[key]) {
      result[key] = {
        pelatihanId,
        namaPelatihan,
        sikapData: {},
        kinerjaData: {},
        ekonomiData: {},
        temaData: {},
        transformasiData: {},
      };
      // Inisialisasi kategori
      for (const [groupKey, groupValue] of Object.entries(mapping)) {
        for (const label of Object.keys(groupValue)) {
          result[key][groupKey as GroupKey][label] = 0;
        }
      }
    }
    const normalizedKalimat = kalimat.toLowerCase();
    for (const [groupKey, groupValue] of Object.entries(mapping)) {
      for (const [label, keywords] of Object.entries(groupValue)) {
        for (const keyword of keywords) {
          if (normalizedKalimat.includes(keyword)) {
            result[key][groupKey as GroupKey][label] += count;
            break;
          }
        }
      }
    }
  }

  // Format output: array per pelatihan, data per kategori
  const output: Array<{
    pelatihanId: number|null,
    namaPelatihan: string|null,
    sikapData: Array<{ kategori: string, jumlah: number }>;
    kinerjaData: Array<{ kategori: string, jumlah: number }>;
    ekonomiData: Array<{ kategori: string, jumlah: number }>;
    temaData: Array<{ kategori: string, jumlah: number }>;
    transformasiData: Array<{ kategori: string, jumlah: number }>;
  }> = [];
  for (const pelKey of Object.keys(result)) {
    const { pelatihanId, namaPelatihan } = result[pelKey];
    const pelObj: {
      pelatihanId: number | null;
      namaPelatihan: string | null;
      sikapData: Array<{ kategori: string, jumlah: number }>;
      kinerjaData: Array<{ kategori: string, jumlah: number }>;
      ekonomiData: Array<{ kategori: string, jumlah: number }>;
      temaData: Array<{ kategori: string, jumlah: number }>;
      transformasiData: Array<{ kategori: string, jumlah: number }>;
    } = {
      pelatihanId,
      namaPelatihan,
      sikapData: [],
      kinerjaData: [],
      ekonomiData: [],
      temaData: [],
      transformasiData: [],
    };
    for (const groupKey of ["sikapData", "kinerjaData", "ekonomiData", "temaData", "transformasiData"] as const) {
      pelObj[groupKey] = Object.entries(result[pelKey][groupKey]).map(([kategori, jumlah]) => ({ kategori, jumlah }));
    }
    output.push(pelObj);
  }
  return output;
}

// Handler GET
export async function GET() {
  try {
    const data = await db
      .select({
        answers: jawaban.answers,
        pelatihanId: pelatihan.id,
        namaPelatihan: pelatihan.nama,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 3))
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id));

    // Kumpulkan kalimat per pelatihan
    const kalimatCount: Array<{ kalimat: string, count: number, pelatihanId: number|null, namaPelatihan: string|null }> = [];
    const kalimatCountObj: Record<string, number> = {};
    for (const item of data) {
      const answers = item.answers as Record<string, string>;
      for (const val of Object.values(answers)) {
        const kalimat = val?.trim();
        if (kalimat && kalimat.length > 0) {
          const normalized = kalimat.replace(/\s+/g, " ");
          kalimatCount.push({ kalimat: normalized, count: 1, pelatihanId: item.pelatihanId ?? null, namaPelatihan: item.namaPelatihan ?? null });
          kalimatCountObj[normalized] = (kalimatCountObj[normalized] || 0) + 1;
        }
      }
    }

    const hasil = mapKalimatToKategoriPerPelatihanArray(kalimatCount);

    return NextResponse.json({
      frekuensi_kalimat: kalimatCountObj,
      data: hasil,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
