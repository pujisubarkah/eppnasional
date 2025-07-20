import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { agenda } from '@/db/agenda'
import { pelatihanAgenda } from '@/db/pelatihan_agenda'
import { subAgenda } from '@/db/sub_agenda'
import { question_options } from '@/db/question_options'
import { eq, and, inArray } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ pelatihan_id: string }> }
) {
  // ✅ Await params karena sekarang Promise
  const { pelatihan_id } = await context.params;
  const pelatihanId = Number(pelatihan_id);
  
  if (isNaN(pelatihanId)) {
    return NextResponse.json({ error: 'Invalid pelatihan_id' }, { status: 400 });
  }

  // Ambil agenda terkait pelatihan
  const agendas = await db
    .select({
      agenda_id: pelatihanAgenda.agenda_id,
      agenda_name: agenda.name,
    })
    .from(pelatihanAgenda)
    .innerJoin(agenda, eq(pelatihanAgenda.agenda_id, agenda.id))
    .where(eq(pelatihanAgenda.pelatihan_id, pelatihanId));

  const agendaIds = agendas.map(a => a.agenda_id).filter((id): id is number => id !== null);

  // Ambil sub agenda
  const subAgendas = await db
    .select()
    .from(subAgenda)
    .where(and(
      eq(subAgenda.pelatihan_id, pelatihanId),
      inArray(subAgenda.agenda_id, agendaIds)
    ));

  // Gabungkan agenda + sub agenda
  const result = agendas.map(a => ({
    id: a.agenda_id,
    name: a.agenda_name,
    sub_agendas: subAgendas
      .filter(s => s.agenda_id === a.agenda_id)
      .map(s => ({
        id: s.id,
        name: s.name,
      })),
  }));

  // Ambil query `pertanyaan_id`
  const { searchParams } = new URL(req.url);
  const pertanyaanId = Number(searchParams.get('pertanyaan_id'));
  let optionsWithSubAgenda: Array<{
    id: number;
    question_id: number;
    option_text: string;
    option_value: number;
    sub_agenda_name: string;
  }> = [];

  if (pertanyaanId && !isNaN(pertanyaanId)) {
    const rawOptions = await db
      .select({
        id: question_options.id,
        question_id: question_options.question_id,
        option_text: question_options.option_text,
        option_value: question_options.option_value,
        sub_agenda_name: subAgenda.name,
      })
      .from(question_options)
      .leftJoin(subAgenda, eq(question_options.option_value, subAgenda.id))
      .where(eq(question_options.question_id, pertanyaanId));

    optionsWithSubAgenda = rawOptions.map(opt => ({
      ...opt,
      sub_agenda_name: opt.sub_agenda_name ?? '',
    }));
  }

  return NextResponse.json({ result, optionsWithSubAgenda });
}