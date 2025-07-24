// app/api/instansi/summary/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { alumni } from '@/db/profile_alumni';
import { instansi } from '@/db/instansi';
import { instansi_kategori } from '@/db/instansi_kategori';
import { eq, count } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db
      .select({
        kategoriId: instansi_kategori.id,
        kategoriNama: instansi_kategori.name,
        instansiId: instansi.id,
        instansiNama: instansi.agency_name,
        jumlahAlumni: count(alumni.id).as('jumlahAlumni'),
      })
      .from(alumni)
      .leftJoin(instansi, eq(alumni.instansiId, instansi.id))
      .leftJoin(instansi_kategori, eq(instansi.agency_category_id, instansi_kategori.id))
      .groupBy(instansi_kategori.id, instansi_kategori.name, instansi.id, instansi.agency_name)
      .orderBy(instansi_kategori.name, instansi.agency_name);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data instansi' }, { status: 500 });
  }
}
