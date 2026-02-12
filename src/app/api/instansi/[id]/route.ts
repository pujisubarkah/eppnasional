import { NextResponse } from "next/server";
import { db } from "@/db";
import { instansi } from "@/db/instansi";
import { eq } from "drizzle-orm";

// GET /api/instansi/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const categoryId = Number(id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  const data = await db
    .select()
    .from(instansi)
    .where(eq(instansi.agency_category_id, categoryId));

  return NextResponse.json(data);
}