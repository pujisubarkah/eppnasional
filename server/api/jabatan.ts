import { jabatan } from '../database/schema/jabatan';
import { db } from '../database/db';

export default defineEventHandler(async () => {
  const data = await db.select().from(jabatan);
  return data;
});