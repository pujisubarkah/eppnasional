import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function GET() {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Laporan Survey 2025", heading: "Title" }),
          new Paragraph({ text: "Executive Summary" }),
          new Paragraph({ text: "Ringkasan eksekutif berisi hasil survey..." }),
          new Paragraph({ text: "Kata Pengantar" }),
          new Paragraph({ text: "Kata pengantar dari penulis laporan..." }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const uint8Array = new Uint8Array(buffer);
  return new NextResponse(uint8Array, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=laporan-survey.docx",
    },
  });
}
