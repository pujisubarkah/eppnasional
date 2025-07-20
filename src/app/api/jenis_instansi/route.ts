import { NextResponse } from "next/server";
import { db } from "@/db";
import { instansi_kategori } from "@/db/instansi_kategori";

export async function GET() {
  const data = await db.select().from(instansi_kategori);
  return NextResponse.json(data);
}