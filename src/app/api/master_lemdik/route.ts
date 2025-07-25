import { NextResponse } from 'next/server';
import { lemdik } from '@/db/master_lemdik';
import { db } from "@/db";

export async function GET() {
  try {
    const result = await db.select().from(lemdik);
    return NextResponse.json({ status: 'success', data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
