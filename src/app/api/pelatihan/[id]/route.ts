// app/api/pelatihan/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pelatihan } from "@/db/pelatihan";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ Await params karena sekarang Promise
  const { id } = await context.params;

  try {
    const data = await db
      .select()
      .from(pelatihan)
      .where(eq(pelatihan.id, Number(id)));

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Pelatihan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0]);
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}