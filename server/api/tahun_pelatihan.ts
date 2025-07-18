import { tahun_pelatihan } from '../database/schema/tahun_pelatihan';
import { db } from '../database/db';

export default defineEventHandler(async () => {
  const data = await db.select().from(tahun_pelatihan);
  return data;
});