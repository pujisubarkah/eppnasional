import { NextResponse } from "next/server";
import { db } from "@/db";
import { alumni } from "@/db/profile_alumni";
import { z } from "zod";

// Skema validasi Zod
const alumniSchema = z.object({
  namaAlumni: z.string().min(1),
  nipNrpNik: z.string().min(1),
  instansiKategoriId: z.number(),
  instansiId: z.number(),
  domisiliId: z.number().nullable().optional(),
  jabatanId: z.number(),
  pelatihanId: z.number(),
  tahunPelatihanId: z.number(),
  lemdik: z.string().optional(),
  handphone: z.string().optional(),
  name: z.string().optional().nullable(),
  hubungan: z.string().optional().nullable(),
  jabatan_alumni: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const body = await req.json();

  const parse = alumniSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      {
        status: "error",
        message: "Data tidak valid",
        errors: parse.error.issues,
        received: body,
      },
      { status: 400 }
    );
  }

  const data = parse.data;

  try {
    const result = await db
      .insert(alumni)
      .values({
        namaAlumni: data.namaAlumni,
        nipNrpNik: data.nipNrpNik,
        instansiKategoriId: data.instansiKategoriId,
        instansiId: data.instansiId,
        domisiliId: !data.domisiliId || data.domisiliId === 0 ? null : data.domisiliId,
        jabatanId: data.jabatanId,
        pelatihanId: data.pelatihanId,
        tahunPelatihanId: data.tahunPelatihanId,
        lemdik: data.lemdik,
        handphone: data.handphone,
        name: data.name,
        hubungan: data.hubungan,
        jabatan_alumni: data.jabatan_alumni,
      })
      .returning({ id: alumni.id });

    return NextResponse.json({
      status: "success",
      message: "Data alumni berhasil disimpan",
      id: result[0]?.id,
      nama: data.namaAlumni,
      pelatihan_id: data.pelatihanId,
    });
  } catch (error) {
    console.error("Error inserting alumni:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal menyimpan data alumni",
        error,
      },
      { status: 500 }
    );
  }
}
