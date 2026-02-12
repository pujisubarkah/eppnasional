import { NextResponse } from 'next/server';
import { db } from '@/db'; // pastikan path sesuai dengan `src/db/index.ts`
import { provinsi } from '@/db/schema';

export async function GET() {
  const results = await db.select().from(provinsi);
  return NextResponse.json(results);
}
