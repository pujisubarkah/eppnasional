import { NextResponse } from 'next/server';
import { db } from '@/db';
import { provinsi } from '@/db/provinsi';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, context: any) {
  const id = parseInt(context?.params?.id);
  try {
    const result = await db.select().from(provinsi).where(eq(provinsi.id, id)).limit(1);
    if (!result.length) {
      return NextResponse.json({ status: 'error', message: 'Provinsi not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data: result[0] });
  } catch (_) {
    return NextResponse.json({ status: 'error', message: 'Internal error' }, { status: 500 });
  }
}
