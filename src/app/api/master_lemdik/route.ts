import { NextResponse } from 'next/server';
import { lemdik } from '@/db/master_lemdik';
import { db } from "@/db";

export async function GET() {
  try {
  // Fetch rows and narrow to objects that contain `namalemdik` for sorting
  const result = (await db.select().from(lemdik)) as Array<{ namalemdik?: string }>;
  // Sort by namalemdik alphabetically (case-insensitive) before returning
  result.sort((a, b) => String(a.namalemdik ?? '').localeCompare(String(b.namalemdik ?? ''), 'id', { sensitivity: 'base' }));
    return NextResponse.json({ status: 'success', data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
