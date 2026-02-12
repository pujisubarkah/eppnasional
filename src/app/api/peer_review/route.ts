import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumni } from "@/db/profile_alumni";

// POST: Tambah data peer review alumni
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi field wajib
    const requiredFields = ["name", "instansiKategoriId", "instansiId"];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Data wajib diisi", missingFields },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(alumni)
      .values({
        
        name: body.name,
        instansiId: body.instansiId,
        jabatanId: body.jabatanId,
        namaAlumni: body.namaAlumni || null,
        hubungan: body.hubungan || null,
        jabatan_alumni: body.jabatan_alumni || null,
        instansiKategoriId: body.instansiKategoriId,
        pelatihanId: body.pelatihanId,
      })
      .returning();

    // Pastikan id dikirim ke frontend
    return NextResponse.json({ success: true, id: inserted[0]?.id, data: inserted[0] });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data", detail: String(err) },
      { status: 500 }
    );
  }
}
