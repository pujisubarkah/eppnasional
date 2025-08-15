import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
import { alumni } from "@/db/profile_alumni";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";

// Fungsi bantu buat n-gram
function getNGrams(tokens: string[], n: number): string[] {
  const grams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.push(tokens.slice(i, i + n).join(" "));
  }
  return grams;
}

// Fungsi bantu untuk ekstrak & hitung n-gram frekuensi
function extractNGramFrequency(texts: string[], n: number): Record<string, number> {
  const freq: Record<string, number> = {};

  for (const text of texts) {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]+/gi, "");
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    const ngrams = getNGrams(tokens, n);

    for (const gram of ngrams) {
      freq[gram] = (freq[gram] || 0) + 1;
    }
  }

  // Filter n-grams with frequency > 2
  const filteredFreq: Record<string, number> = {};
  for (const [gram, frequency] of Object.entries(freq)) {
    if (frequency > 1) {
      filteredFreq[gram] = frequency;
    }
  }

  return filteredFreq;
}

// Helper function to filter and deduplicate suggestions
function filterAndDeduplicateTexts(texts: string[]): string[] {
  return texts
    .filter(text => text && text.trim() !== '' && text.trim() !== '-')
    .filter((text, index, self) => self.indexOf(text) === index); // Remove duplicates
}

export async function GET() {
  try {
    const rows = await db
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
      .where(eq(jawaban.category_id, 7))
      .leftJoin(alumni, eq(jawaban.user_id, alumni.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id));

    // Get unique pelatihan list
    const pelatihanSet = new Map<number, string>();
    for (const row of rows) {
      if (row.pelatihanId && row.namaPelatihan) {
        pelatihanSet.set(row.pelatihanId, row.namaPelatihan);
      }
    }
    const pelatihanList = Array.from(pelatihanSet.entries()).map(([id, nama]) => ({
      pelatihanId: id,
      namaPelatihan: nama,
    }));

    // Group data by pelatihan
    const pelatihanData: Record<string, {
      pelatihanId: number | null;
      namaPelatihan: string | null;
      data: {
        metode: string[];
        materi: string[];
        waktu: string[];
        pengajar: string[];
      };
      ngram: {
        metode: { bigram: Record<string, number>; trigram: Record<string, number> };
        materi: { bigram: Record<string, number>; trigram: Record<string, number> };
        waktu: { bigram: Record<string, number>; trigram: Record<string, number> };
        pengajar: { bigram: Record<string, number>; trigram: Record<string, number> };
      };
    }> = {};

    // Initialize grouping structure
    for (const row of rows) {
      const pelatihanId = row.pelatihanId ?? null;
      const namaPelatihan = row.namaPelatihan ?? null;
      const pelKey = pelatihanId ? String(pelatihanId) : "null";
      
      if (!pelatihanData[pelKey]) {
        pelatihanData[pelKey] = {
          pelatihanId,
          namaPelatihan,
          data: {
            metode: [],
            materi: [],
            waktu: [],
            pengajar: [],
          },
          ngram: {
            metode: { bigram: {}, trigram: {} },
            materi: { bigram: {}, trigram: {} },
            waktu: { bigram: {}, trigram: {} },
            pengajar: { bigram: {}, trigram: {} },
          },
        };
      }
    }

    // Group answers by pelatihan
    for (const row of rows) {
      const pelatihanId = row.pelatihanId ?? null;
      const pelKey = pelatihanId ? String(pelatihanId) : "null";
      const a = row.answers as Record<string, string>;
      
      if (a.q1 && a.q1.trim() !== '' && a.q1.trim() !== '-') pelatihanData[pelKey].data.metode.push(a.q1.trim());
      if (a.q2 && a.q2.trim() !== '' && a.q2.trim() !== '-') pelatihanData[pelKey].data.materi.push(a.q2.trim());
      if (a.q3 && a.q3.trim() !== '' && a.q3.trim() !== '-') pelatihanData[pelKey].data.waktu.push(a.q3.trim());
      if (a.q4 && a.q4.trim() !== '' && a.q4.trim() !== '-') pelatihanData[pelKey].data.pengajar.push(a.q4.trim());
    }

    // Remove duplicates from each pelatihan data
    for (const pelKey of Object.keys(pelatihanData)) {
      pelatihanData[pelKey].data.metode = filterAndDeduplicateTexts(pelatihanData[pelKey].data.metode);
      pelatihanData[pelKey].data.materi = filterAndDeduplicateTexts(pelatihanData[pelKey].data.materi);
      pelatihanData[pelKey].data.waktu = filterAndDeduplicateTexts(pelatihanData[pelKey].data.waktu);
      pelatihanData[pelKey].data.pengajar = filterAndDeduplicateTexts(pelatihanData[pelKey].data.pengajar);
    }

    // Calculate n-grams for each pelatihan
    for (const pelKey of Object.keys(pelatihanData)) {
      const grouped = pelatihanData[pelKey].data;
      
      pelatihanData[pelKey].ngram = {
        metode: {
          bigram: extractNGramFrequency(grouped.metode, 2),
          trigram: extractNGramFrequency(grouped.metode, 3),
        },
        materi: {
          bigram: extractNGramFrequency(grouped.materi, 2),
          trigram: extractNGramFrequency(grouped.materi, 3),
        },
        waktu: {
          bigram: extractNGramFrequency(grouped.waktu, 2),
          trigram: extractNGramFrequency(grouped.waktu, 3),
        },
        pengajar: {
          bigram: extractNGramFrequency(grouped.pengajar, 2),
          trigram: extractNGramFrequency(grouped.pengajar, 3),
        },
      };
    }

    // Also create aggregated data for backward compatibility
    const aggregatedData = {
      metode: [] as string[],
      materi: [] as string[],
      waktu: [] as string[],
      pengajar: [] as string[],
    };

    for (const pelKey of Object.keys(pelatihanData)) {
      const data = pelatihanData[pelKey].data;
      aggregatedData.metode.push(...data.metode);
      aggregatedData.materi.push(...data.materi);
      aggregatedData.waktu.push(...data.waktu);
      aggregatedData.pengajar.push(...data.pengajar);
    }

    // Remove duplicates from aggregated data as well
    aggregatedData.metode = filterAndDeduplicateTexts(aggregatedData.metode);
    aggregatedData.materi = filterAndDeduplicateTexts(aggregatedData.materi);
    aggregatedData.waktu = filterAndDeduplicateTexts(aggregatedData.waktu);
    aggregatedData.pengajar = filterAndDeduplicateTexts(aggregatedData.pengajar);

    const aggregatedNgram = {
      metode: {
        bigram: extractNGramFrequency(aggregatedData.metode, 2),
        trigram: extractNGramFrequency(aggregatedData.metode, 3),
      },
      materi: {
        bigram: extractNGramFrequency(aggregatedData.materi, 2),
        trigram: extractNGramFrequency(aggregatedData.materi, 3),
      },
      waktu: {
        bigram: extractNGramFrequency(aggregatedData.waktu, 2),
        trigram: extractNGramFrequency(aggregatedData.waktu, 3),
      },
      pengajar: {
        bigram: extractNGramFrequency(aggregatedData.pengajar, 2),
        trigram: extractNGramFrequency(aggregatedData.pengajar, 3),
      },
    };

    return NextResponse.json({
      data: aggregatedData,
      ngram: aggregatedNgram,
      pelatihanList: pelatihanList,
      pelatihanData: Object.values(pelatihanData),
    });
  } catch (error) {
    console.error("Error mapping saran:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
