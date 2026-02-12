import { NextResponse } from 'next/server';
import { db } from '@/db';
import { alumni } from '@/db/profile_alumni';
import { provinsi } from '@/db/provinsi';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db
      .select({
        provinsiId: provinsi.id,
        provinsiNama: provinsi.nama,
        svgPath: provinsi.svg_path, // 👈 tambahin ini
        jumlahAlumni: count(alumni.id).as('jumlahAlumni'),
      })
      .from(provinsi)
      .leftJoin(alumni, eq(provinsi.id, alumni.domisiliId))
      .groupBy(provinsi.id, provinsi.nama, provinsi.svg_path) // 👈 group by juga svg_path
      .orderBy(provinsi.nama);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data' }, { status: 500 });
  }
}
