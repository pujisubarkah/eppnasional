import { db } from '@/db/index';
import { alumni } from '@/db/profile_alumni';
import { pelatihan } from '@/db/pelatihan';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(
      sql`
        SELECT p.id, p.nama AS pelatihan, COUNT(a.id) AS total_alumni
        FROM ${pelatihan} p
        LEFT JOIN ${alumni} a ON a.pelatihan_id = p.id
        GROUP BY p.id, p.nama
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
