// ~/server/api/pelatihan/[id].ts

import { pelatihan } from '@/server/database/schema/pelatihan';
import { db } from '@/server/database/db';
import { defineEventHandler, getRouterParam } from 'h3';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    return {
      status: 'error',
      message: 'ID pelatihan tidak ditemukan',
    };
  }

  const data = await db.select().from(pelatihan).where(eq(pelatihan.id, Number(id))).limit(1);

  return data[0] || null;
});
