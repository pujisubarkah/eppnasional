import { NextResponse } from "next/server";
import { db } from "@/db"; // pastikan ini adalah koneksi drizzle
import { instansi } from "@/db/instansi";

export async function GET() {
  const data = await db.select().from(instansi);
  return NextResponse.json(data);
}