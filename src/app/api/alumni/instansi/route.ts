import { db } from '@/db/index';
import { sql } from 'drizzle-orm';
import { instansi_kategori } from '@/db/instansi_kategori';
import { instansi } from '@/db/instansi';
import { alumni } from '@/db/profile_alumni';

export async function GET() {
  try {
    const result = await db.execute(
      sql`
        SELECT k.id, k.kat_instansi AS nama_kategori, COUNT(a.id) AS total_alumni
        FROM ${instansi_kategori} k
        LEFT JOIN ${instansi} i ON i.agency_category_id = k.id
        LEFT JOIN ${alumni} a ON a.instansi_id = i.id
        GROUP BY k.id, k.kat_instansi
        ORDER BY total_alumni DESC
      `
    );
    return new Response(JSON.stringify(result.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Gagal mengambil data', detail: String(error) }),
      { status: 500 }
    );
  }
}