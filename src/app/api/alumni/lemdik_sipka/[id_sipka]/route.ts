import { NextResponse } from "next/server";
import { db } from '@/db/index';
import { alumni } from "@/db/schema";
import { lemdik as masterLemdik } from '@/db/master_lemdik';
import { eq, sql } from "drizzle-orm";

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

    // Query dengan filter berdasarkan ID SIPKA
    const result = await db
      .select({
        id: alumni.id,
        namaAlumni: alumni.namaAlumni,
        lemdik: alumni.lemdik,
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

    // Cek apakah data ditemukan
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data dengan ID SIPKA tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result // Return array karena bisa ada multiple alumni dengan ID SIPKA yang sama
    });
  } catch (error) {
    console.error("Error getting alumni by ID SIPKA:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: errorMessage },
      { status: 500 }
    );
  }
}