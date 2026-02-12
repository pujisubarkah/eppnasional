import { NextResponse } from "next/server";
import { db } from "@/db";
import { jabatan } from "@/db/jabatan";

export async function GET() {
  const data = await db.select().from(jabatan);
  return NextResponse.json(data);
}