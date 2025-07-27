import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
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
function mapKalimatToKategori(frekuensiKalimat: Record<string, number>) {
  const result = {
    sikapData: {} as Record<string, number>,
    kinerjaData: {} as Record<string, number>,
    ekonomiData: {} as Record<string, number>,
    temaData: {} as Record<string, number>,
    transformasiData: {} as Record<string, number>,
  };

  // Inisialisasi
  for (const [groupKey, groupValue] of Object.entries(mapping)) {
    for (const [label, _] of Object.entries(groupValue)) {
      result[groupKey as keyof typeof result][label] = 0;
    }
  }

  // Proses frekuensi
  for (const [kalimat, count] of Object.entries(frekuensiKalimat)) {
    const normalizedKalimat = kalimat.toLowerCase();

    for (const [groupKey, groupValue] of Object.entries(mapping)) {
      for (const [label, keywords] of Object.entries(groupValue)) {
        for (const keyword of keywords) {
          if (normalizedKalimat.includes(keyword)) {
            result[groupKey as keyof typeof result][label] += count;
            break;
          }
        }
      }
    }
  }

  return {
    sikapData: Object.entries(result.sikapData).map(([kategori, jumlah]) => ({ kategori, jumlah })),
    kinerjaData: Object.entries(result.kinerjaData).map(([kategori, jumlah]) => ({ kategori, jumlah })),
    ekonomiData: Object.entries(result.ekonomiData).map(([kategori, value]) => ({ kategori, value })),
    temaData: Object.entries(result.temaData).map(([kategori, value]) => ({ kategori, value })),
    transformasiData: Object.entries(result.transformasiData).map(([kategori, value]) => ({ kategori, value })),
  };
}

// Handler GET
export async function GET() {
  try {
    const data = await db
      .select({
        answers: jawaban.answers,
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 3));

    const kalimatCount: Record<string, number> = {};

    for (const item of data) {
      const answers = item.answers as Record<string, string>;

      for (const val of Object.values(answers)) {
        const kalimat = val?.trim();
        if (kalimat && kalimat.length > 0) {
          const normalized = kalimat.replace(/\s+/g, " ");
          kalimatCount[normalized] = (kalimatCount[normalized] || 0) + 1;
        }
      }
    }

    const hasil = mapKalimatToKategori(kalimatCount);

    return NextResponse.json({
      frekuensi_kalimat: kalimatCount,
      ...hasil,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
