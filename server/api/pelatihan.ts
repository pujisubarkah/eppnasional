import { pelatihan } from '../database/schema/pelatihan';
import { db } from '../database/db';

export default defineEventHandler(async () => {
  const data = await db.select().from(pelatihan);
  return data;
});