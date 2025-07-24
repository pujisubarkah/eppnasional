import { db } from '@/db/index';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(
      sql`
        SELECT k.id, k.nama_kategori, COUNT(a.id) AS total_alumni
        FROM instansi_kategori k
        LEFT JOIN instansi i ON i.agency_category_id = k.id
        LEFT JOIN informasi_profile a ON a.instansiId = i.id
        GROUP BY k.id, k.nama_kategori
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