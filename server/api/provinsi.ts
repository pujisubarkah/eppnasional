import { provinsi } from '../database/schema/provinsi';
import { db } from '../database/db';

export default defineEventHandler(async () => {
  const data = await db.select().from(provinsi);
  return data;
});
