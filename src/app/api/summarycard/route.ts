import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumni } from "@/db/profile_alumni";
import {  inArray, countDistinct, count } from "drizzle-orm";

export async function GET() {
  // Ambil total semua alumni
  const totalResponden = await db
    .select({ count: count() })
    .from(alumni);

  // Mapping id ke tahun
  const tahunMap: Record<number, number> = {
    1: 2021,
    2: 2022,
    3: 2023,
    4: 2024,
  };

  // Ambil total alumni berdasarkan tahun_pelatihan_id
  const alumniPerTahun = await db
    .select({
      tahunId: alumni.tahunPelatihanId,
      count: count(),
    })
    .from(alumni)
    .where(inArray(alumni.tahunPelatihanId, [1, 2, 3, 4]))
    .groupBy(alumni.tahunPelatihanId);

  // Hitung jumlah instansi unik
  const totalInstansi = await db
    .select({ count: countDistinct(alumni.instansiId) })
    .from(alumni);

  // Mapping hasil ke tahun sebenarnya
  const tahunPelatihan: Record<number, number> = {};
  alumniPerTahun.forEach((row) => {
    const tahun = tahunMap[row.tahunId as number];
    if (tahun) tahunPelatihan[tahun] = row.count;
  });

  return NextResponse.json({
    status: "success",
    summary: {
      totalResponden: totalResponden[0].count,
      tahunPelatihan,
      totalInstansi: totalInstansi[0].count,
    },
  });
}
