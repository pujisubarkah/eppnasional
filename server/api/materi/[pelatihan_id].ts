import { defineEventHandler, getRouterParam } from 'h3'
import { db } from '~/server/database/db'
import { agenda } from '~/server/database/schema/agenda'
import { pelatihanAgenda } from '~/server/database/schema/pelatihan_agenda'
import { subAgenda } from '~/server/database/schema/sub_agenda'
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

  return result
})
