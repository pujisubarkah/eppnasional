import { defineEventHandler, getRouterParam, getQuery } from 'h3'
import { db } from '~/server/database/db'
import { agenda } from '~/server/database/schema/agenda'
import { pelatihanAgenda } from '~/server/database/schema/pelatihan_agenda'
import { subAgenda } from '~/server/database/schema/sub_agenda'
import { question_options } from '~/server/database/schema/question_options'
import { eq, and, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const pelatihan_id = Number(getRouterParam(event, 'pelatihan_id'))

  // Dapatkan agenda_id yang terkait dengan pelatihan
  const agendas = await db
    .select({
      agenda_id: pelatihanAgenda.agenda_id,
      agenda_name: agenda.name,
    })
    .from(pelatihanAgenda)
    .innerJoin(agenda, eq(pelatihanAgenda.agenda_id, agenda.id))
    .where(eq(pelatihanAgenda.pelatihan_id, pelatihan_id))

  const agendaIds = agendas.map(a => a.agenda_id).filter((id): id is number => id !== null)

  // Ambil semua sub agenda terkait agenda dan pelatihan
  const subAgendas = await db
    .select()
    .from(subAgenda)
    .where(and(
      eq(subAgenda.pelatihan_id, pelatihan_id),
      inArray(subAgenda.agenda_id, agendaIds)
    ))

  // Gabungkan data agenda + sub agenda
  const result = agendas.map(a => ({
    id: a.agenda_id,
    name: a.agenda_name,
    sub_agendas: subAgendas
      .filter(s => s.agenda_id === a.agenda_id)
      .map(s => ({ id: s.id, name: s.name }))
  }))

  // Ambil semua opsi untuk pertanyaan tertentu, beserta sub agenda id
  const { pertanyaan_id } = getQuery(event);
  const pertanyaanId = Number(pertanyaan_id);

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
      sub_agenda_name: opt.sub_agenda_name ?? "",
    }));
  }

  return {
    result,
    optionsWithSubAgenda,
  };
})
