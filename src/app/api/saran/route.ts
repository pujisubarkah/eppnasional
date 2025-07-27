import { NextResponse } from "next/server";
import { db } from "@/db";
import { jawaban } from "@/db/jawaban";
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

  return freq;
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
      })
      .from(jawaban)
      .where(eq(jawaban.category_id, 7));

    const grouped = {
      metode: [] as string[],
      materi: [] as string[],
      waktu: [] as string[],
      pengajar: [] as string[],
    };

    for (const row of rows) {
      const a = row.answers as Record<string, string>;
      if (a.q1) grouped.metode.push(a.q1.trim());
      if (a.q2) grouped.materi.push(a.q2.trim());
      if (a.q3) grouped.waktu.push(a.q3.trim());
      if (a.q4) grouped.pengajar.push(a.q4.trim());
    }

    const ngramResult = {
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

    return NextResponse.json({
      data: grouped,
      ngram: ngramResult,
    });
  } catch (error) {
    console.error("Error mapping saran:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
