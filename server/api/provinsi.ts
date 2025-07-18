import { provinsi } from '../database/schema/provinsi';
import { db } from '../database/db';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  const data = await db.select().from(provinsi).orderBy(asc(provinsi.nama));
  return data;
});
