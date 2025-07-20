// src/app/api/agenda/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db'; // pastikan path sesuai dengan `src/db/index.ts`
import { agenda } from '@/db/schema';

export async function GET() {
  const results = await db.select().from(agenda);
  return NextResponse.json(results);
}

