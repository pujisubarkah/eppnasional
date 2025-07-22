import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumni } from "@/db/peer_review";

// POST: Tambah data peer review alumni
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi sederhana, bisa dikembangkan sesuai kebutuhan
    if (!body.name || !body.jenisinstansi || !body.instansiId) {
      return NextResponse.json({ error: "Data wajib diisi" }, { status: 400 });
    }

    const inserted = await db
      .insert(alumni)
      .values({
        name: body.name,
        jenisinstansi: body.jenisinstansi,
        instansiId: body.instansiId,
        jabatanId: body.jabatanId,
        namaAlumni: body.namaAlumni,
        hubungan: body.hubungan,
        jabatan_alumni: body.jabatan_alumni,
        instansiKategoriId: body.instansiKategoriId,
        pelatihanId: body.pelatihanId,
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan data", detail: String(err) }, { status: 500 });
  }
}

