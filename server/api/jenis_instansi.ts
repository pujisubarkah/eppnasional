import { instansi_kategori } from '../database/schema/instansi_kategori';
import { db } from '../database/db';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  const data = await db.select().from(instansi_kategori).orderBy(asc(instansi_kategori.id));
  return data;
}); 