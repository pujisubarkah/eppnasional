import { NextResponse } from "next/server";
import { db } from '@/db/index';
import { alumni } from "@/db/schema";
import { lemdik as masterLemdik } from '@/db/master_lemdik';
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Query untuk mendapatkan semua data alumni dengan join ke master_lemdik
    const result = await db
      .select({
        id: alumni.id,
        namaAlumni: alumni.namaAlumni,
        lemdik: alumni.lemdik,
        idSipka: masterLemdik.idsipka,
      })
      .from(alumni)
      .innerJoin(
        masterLemdik,
        sql`LOWER(TRIM(${alumni.lemdik})) = LOWER(TRIM(${masterLemdik.namalemdik}))`
      );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error getting all alumni lemdik sipka:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: errorMessage },
      { status: 500 }
    );
  }
}
