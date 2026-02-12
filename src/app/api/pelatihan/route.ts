import { NextResponse } from "next/server";
import { db } from "@/db";
import { pelatihan } from "@/db/pelatihan";

export async function GET() {
  const data = await db.select().from(pelatihan);
  return NextResponse.json(data);
}