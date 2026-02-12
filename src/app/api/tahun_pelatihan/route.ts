import { NextResponse } from "next/server";
import { db } from "@/db";
import { tahun_pelatihan } from "@/db/tahun_pelatihan";

export async function GET() {
  const data = await db.select().from(tahun_pelatihan);
  return NextResponse.json(data);
}