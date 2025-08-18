import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";

// Keyword mapping untuk masing-masing kategori
const mapping = {
  sikapData: {
    "Peningkatan kemampuan mengembangkan kepemimpinan kolaboratif": ["peningkatan kemampuan mengembangkan kepemimpinan kolaboratif"],
    "Peningkatan inovasi/kreatifitas dalam berkinerja": ["peningkatan inovasi kreatifitas dalam berkinerja", "peningkatan inovasi/kreatifitas dalam berkinerja"],
    "Peningkatan Percaya diri dalam mengelola kebijakan": ["peningkatan percaya diri dalam mengelola kebijakan"],
    "Peningkatan Motivasi dalam Penyusunan kebijakan dan strategi etika dan integritas": ["peningkatan motivasi dalam penyusunan kebijakan dan strategi etika dan integritas"],
    "Peningkatan Percaya diri dalam mengelola organisasi secara strategis": ["peningkatan percaya diri dalam mengelola organisasi secara strategis"],
    "Peningkatan Motivasi dalam membangun etika dan integritas organisasi": ["peningkatan motivasi dalam membangun etika dan integritas organisasi"],
    "Peningkatan Inovasi/Kreativitas dalam berkinerja": ["peningkatan inovasi kreativitas dalam berkinerja", "peningkatan inovasi/kreativitas dalam berkinerja"],
    "Peningkatan Kemampuan dalam mengembangkan kepemimpinan stategis": ["peningkatan kemampuan dalam mengembangkan kepemimpinan stategis", "peningkatan kemampuan dalam mengembangkan kepemimpinan strategis"],
    "Peningkatan Motivasi/Percaya diri dalam mengaktualisasikan kepempimpinan kinerja": ["peningkatan motivasi percaya diri dalam mengaktualisasikan kepempimpinan kinerja", "peningkatan motivasi/percaya diri dalam mengaktualisasikan kepempimpinan kinerja", "peningkatan motivasi percaya diri dalam mengaktualisasikan kepemimpinan kinerja"],
    "Peningkatan Motivasi dalam menegakkan etika dan integritas di Unit Kerja": ["peningkatan motivasi dalam menegakkan etika dan integritas di unit kerja"],
    "Peningkatan Inovasi/Kreativitas dalam mendukung kinerja organisasi": ["peningkatan inovasi kreativitas dalam mendukung kinerja organisasi", "peningkatan inovasi/kreativitas dalam mendukung kinerja organisasi"],
    "Peningkatan Motivasi dalam penerapan etika dan integritas di Unit Kerja": ["peningkatan motivasi dalam penerapan etika dan integritas di unit kerja"],
    "Peningkatan Motivasi/percaya dirii dalam pengelolaan pelayanan publik": ["peningkatan motivasi percaya dirii dalam pengelolaan pelayanan publik", "peningkatan motivasi/percaya dirii dalam pengelolaan pelayanan publik", "peningkatan motivasi percaya diri dalam pengelolaan pelayanan publik"],
    "Peningkatan Inovasi/Kreativitas yang mendukung pelayanan publik": ["peningkatan inovasi kreativitas yang mendukung pelayanan publik", "peningkatan inovasi/kreativitas yang mendukung pelayanan publik"],
    "Peningkatan motivasi untuk menerapkan etika dan integritas dalam berkinerja": ["peningkatan motivasi untuk menerapkan etika dan integritas dalam berkinerja"],
    "Peningkatan percaya diri dalam menginternalisasi nilai ASN BerAKHLAK": ["peningkatan percaya diri dalam menginternalisasi nilai asn berakhlak"],
    "Peningkatan inovasi/kreativitas yang mendukung terwujudnya smart governance": ["peningkatan inovasi kreativitas yang mendukung terwujudnya smart governance", "peningkatan inovasi/kreativitas yang mendukung terwujudnya smart governance"],
  },
  kinerjaData: {
    "Peningkatan Kinerja Individu": ["peningkatan kinerja individu"],
    "Peningkatan Pengetahuan dan Keterampilan": ["peningkatan pengetahuan dan keterampilan"],
    "Mengelola Perubahan": ["mengelola perubahan"],
    "Peningkatan Kualitas Pelayanan Publik": ["peningkatan kualitas pelayanan publik"],
    "Peningkatan Kemampuan, Menggerakkan Stakeholders": ["peningkatan kemampuan menggerakkan stakeholders", "peningkatan kemampuan, menggerakkan stakeholders"],
    "Peningkatan Jejaring Kerja": ["peningkatan jejaring kerja"],
    "Peningkatan Kepuasan Pelanggan": ["peningkatan kepuasan pelanggan"],
  },
  ekonomiData: {
    "Kurang dari Rp.100.000.000,- (seratus juta rupiah)": ["Kurang dari Rp.100.000.000,- (seratus juta rupiah)"],
    "Lebih dari Rp10.000.000.000,- (sepuluh miliar rupiah)": ["Lebih dari Rp10.000.000.000,- (sepuluh miliar rupiah)"],
    "Rp1.000.000.001,- s.d. Rp10.000.000.000,-": ["Rp1.000.000.001,- s.d. Rp10.000.000.000,-"],
    "Rp100.000.000,- s.d. Rp1.000.000.000,-": ["Rp100.000.000,- s.d. Rp1.000.000.000,-"],
    "Kurang dari Rp 50.000.000 ( lima puluh juta rupiah)": ["Kurang dari Rp 50.000.000 ( lima puluh juta rupiah)"],
    "Rp 50.000.000,- s.d Rp 100.000.000,-": ["Rp 50.000.000,- s.d Rp 100.000.000,-"],
    "Rp 100.000.001,- s.d Rp 500.000.000,-": ["Rp 100.000.001,- s.d Rp 500.000.000,-"],
    "Lebih dari Rp 500.000.000,- (lima ratus juta rupiah)": ["Lebih dari Rp 500.000.000,- (lima ratus juta rupiah)"],
  },
  temaData: {
    "Pengentasan kemiskinan": ["pengentasan kemiskinan"],
    "Peningkatan investasi": ["peningkatan investasi"],
    "Digitalisasi administrasi pemerintahan": ["digitalisasi administrasi pemerintahan"],
  },
  transformasiData: {
    "Transformasi Ekonomi": ["transformasi ekonomi"],
    "Transformasi Tata Kelola": ["transformasi tata kelola"],
    "Transformasi Sosial": ["transformasi sosial"],
  },
  subBidangData: {
    // Sub-bidang Transformasi Sosial
    "Kesehatan untuk semua": ["kesehatan untuk semua"],
    "Pendidikan berkualitas yang merata": ["pendidikan berkualitas yang merata"],
    "Perlindungan social yang adaptif": ["perlindungan social yang adaptif"],
    "Perlindungan social": ["perlindungan social"],
    "Budaya dan agama": ["budaya dan agama"],
    // Sub-bidang Transformasi Ekonomi
    "Iptek, Inovasi dan Produktifitas ekonomi": ["iptek inovasi dan produktifitas ekonomi", "iptek, inovasi dan produktifitas ekonomi"],
    "Penerapan Ekonomi Hijau": ["penerapan ekonomi hijau"],
    "Transformasi Digital": ["transformasi digital"],
    "Integrasi Ekonomi Domestic dan Global": ["integrasi ekonomi domestic dan global"],
    "Perkotaan dan Pedesaan sebagai Pusat Pemerintahan Ekonomi": ["perkotaan dan pedesaan sebagai pusat pemerintahan ekonomi"],
    // Sub-bidang Transformasi Tata Kelola
    "Regulasi dan Tata Kelola yang berintegritas dan adaptif": ["regulasi dan tata kelola yang berintegritas dan adaptif"],
  },
};

// Fungsi pemetaan kalimat ke kategori

// Fungsi pemetaan kalimat ke kategori per pelatihan, hasil: array per pelatihan
function mapKalimatToKategoriPerPelatihanArray(frekuensiKalimat: Array<{ kalimat: string, count: number, pelatihanId: number|null, namaPelatihan: string|null }>) {
  // { [pelatihanId]: { namaPelatihan, ...kategoriData } }
  type KategoriGroup = Record<string, number>;
  type GroupKey = "sikapData" | "kinerjaData" | "ekonomiData" | "temaData" | "transformasiData" | "subBidangData";
  type PelatihanResult = {
    pelatihanId: number | null;
    namaPelatihan: string | null;
    sikapData: KategoriGroup;
    kinerjaData: KategoriGroup;
    ekonomiData: KategoriGroup;
    temaData: KategoriGroup;
    transformasiData: KategoriGroup;
    subBidangData: KategoriGroup;
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
        subBidangData: {},
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
          // Untuk ekonomiData, lakukan exact match tanpa normalisasi
          const isMatch = groupKey === 'ekonomiData' 
            ? kalimat.includes(keyword)
            : normalizedKalimat.includes(keyword);
          
          if (isMatch) {
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
    subBidangData: Array<{ kategori: string, jumlah: number }>;
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
      subBidangData: Array<{ kategori: string, jumlah: number }>;
    } = {
      pelatihanId,
      namaPelatihan,
      sikapData: [],
      kinerjaData: [],
      ekonomiData: [],
      temaData: [],
      transformasiData: [],
      subBidangData: [],
    };
    for (const groupKey of ["sikapData", "kinerjaData", "ekonomiData", "temaData", "transformasiData", "subBidangData"] as const) {
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
      
      // Proses semua field kecuali sub_bidang
      for (const [key, val] of Object.entries(answers)) {
        if (key !== 'sub_bidang') {
          const kalimat = val?.trim();
          if (kalimat && kalimat.length > 0) {
            const normalized = kalimat.replace(/\s+/g, " ");
            kalimatCount.push({ kalimat: normalized, count: 1, pelatihanId: item.pelatihanId ?? null, namaPelatihan: item.namaPelatihan ?? null });
            kalimatCountObj[normalized] = (kalimatCountObj[normalized] || 0) + 1;
          }
        }
      }
      
      // Proses sub_bidang secara terpisah
      if (answers.sub_bidang) {
        const subBidang = answers.sub_bidang?.trim();
        if (subBidang && subBidang.length > 0) {
          const normalized = subBidang.replace(/\s+/g, " ");
          kalimatCount.push({ kalimat: normalized, count: 1, pelatihanId: item.pelatihanId ?? null, namaPelatihan: item.namaPelatihan ?? null });
          kalimatCountObj[normalized] = (kalimatCountObj[normalized] || 0) + 1;
        }
      }
    }

    const hasil = mapKalimatToKategoriPerPelatihanArray(kalimatCount);

    return NextResponse.json({
      data: hasil,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
