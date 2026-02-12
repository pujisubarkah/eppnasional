// src/app/api/profile_alumni/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumni } from "@/db/profile_alumni";
import { instansi_kategori } from "@/db/instansi_kategori";
import { instansi } from "@/db/instansi";
import { provinsi } from "@/db/provinsi";
import { jabatan } from "@/db/jabatan";
import { pelatihan } from "@/db/pelatihan";
import { tahun_pelatihan } from "@/db/tahun_pelatihan";
import { eq } from "drizzle-orm";

// PUT: Update data alumni berdasarkan ID
// Perubahan 1: Tandai params sebagai Promise
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Perubahan 2: AWAIT params terlebih dahulu
  const { id } = await params;
  const alumniId = parseInt(id); // Gunakan id yang sudah di-await

  if (isNaN(alumniId)) {
    return NextResponse.json(
      { status: "error", message: "ID tidak valid" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    // Validasi field wajib
    if (!body.namaAlumni || !body.nipNrpNik) {
      return NextResponse.json(
        { status: "error", message: "Field wajib tidak lengkap" },
        { status: 400 }
      );
    }

    const updateResult = await db
      .update(alumni)
      .set({
        namaAlumni: body.namaAlumni,
        nipNrpNik: body.nipNrpNik,
        instansiKategoriId: body.instansiKategoriId ? Number(body.instansiKategoriId) : undefined,
        instansiId: body.instansiId ? Number(body.instansiId) : undefined,
        domisiliId: body.domisiliId ? Number(body.domisiliId) : undefined,
        jabatanId: body.jabatanId ? Number(body.jabatanId) : undefined,
        pelatihanId: body.pelatihanId ? Number(body.pelatihanId) : undefined,
        tahunPelatihanId: body.tahunPelatihanId ? Number(body.tahunPelatihanId) : undefined,
        lemdik: body.lemdik,
        handphone: body.handphone,
      })
      .where(eq(alumni.id, alumniId));

    // Catatan: rowCount mungkin tidak tersedia tergantung driver database Drizzle
    // Jika rowCount tidak dapat diandalkan, pertimbangkan untuk memeriksa result[0]?.id
    // atau menggunakan metode lain untuk menentukan apakah update berhasil.
    // Misalnya: const result = await db.update(...).where(...).returning({id: alumni.id});
    // if (!result.length) { ... }
    if (updateResult.rowCount !== undefined && updateResult.rowCount === 0) {
      return NextResponse.json(
        { status: "error", message: "Data alumni tidak ditemukan atau tidak diupdate" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      status: "success", 
      message: "Data alumni berhasil diupdate" 
    });
  } catch (error) {
    console.error("Error updating alumni:", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json(
      { status: "error", message: "Gagal update data alumni", error: errorMessage },
      { status: 500 }
    );
  }
}

// GET: Ambil data alumni lengkap beserta relasi
// Perubahan 1: Tandai params sebagai Promise
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Tandai sebagai Promise
) {
  // Perubahan 2: AWAIT params terlebih dahulu
  const { id } = await params; // AWAIT params terlebih dahulu
  const alumniId = parseInt(id); // Gunakan id yang sudah di-await

  if (isNaN(alumniId)) {
    return NextResponse.json(
      { status: "error", message: "ID tidak valid" },
      { status: 400 }
    );
  }

  try {
    const result = await db
      .select({
        id: alumni.id,
        namaAlumni: alumni.namaAlumni,
        nipNrpNik: alumni.nipNrpNik,
        instansiKategori: instansi_kategori.name,
        instansi: instansi.agency_name,
        domisili: provinsi.nama,
        jabatan: jabatan.nama,
        pelatihan: pelatihan.nama,
        tahunPelatihan: tahun_pelatihan.tahun,
        lemdik: alumni.lemdik,
        handphone: alumni.handphone,
        createdAt: alumni.createdAt,
        name: alumni.name,
        hubungan: alumni.hubungan,
        jabatan_alumni: alumni.jabatan_alumni,
      })
      .from(alumni)
      .where(eq(alumni.id, alumniId))
      .leftJoin(instansi_kategori, eq(alumni.instansiKategoriId, instansi_kategori.id))
      .leftJoin(instansi, eq(alumni.instansiId, instansi.id))
      .leftJoin(provinsi, eq(alumni.domisiliId, provinsi.id))
      .leftJoin(jabatan, eq(alumni.jabatanId, jabatan.id))
      .leftJoin(pelatihan, eq(alumni.pelatihanId, pelatihan.id))
      .leftJoin(tahun_pelatihan, eq(alumni.tahunPelatihanId, tahun_pelatihan.id));

    if (!result.length) {
      return NextResponse.json(
        { status: "error", message: "Data alumni tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching alumni with relation:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal mengambil data alumni",
        error: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error),
      },
      { status: 500 }
    );
  }
}