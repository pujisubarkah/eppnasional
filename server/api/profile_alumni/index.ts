import { defineEventHandler, readBody, getMethod } from 'h3'
import { db } from '~/server/database/db'
import { alumni } from '@/server/database/schema/profile_alumni'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    try {
      const results = await db.select().from(alumni).orderBy(alumni.id) // bisa pakai pagination juga
      return { status: 'success', data: results }
    } catch (error) {
      console.error('GET error:', error)
      return createError({
        statusCode: 500,
        statusMessage: 'Gagal mengambil data alumni',
        data: error
      })
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)

    // Validasi input pakai Zod
    const AlumniSchema = z.object({
      namaAlumni: z.string(),
      nipNrpNik: z.string(),
      instansiKategoriId: z.number(),
      instansiId: z.number(),
      domisiliId: z.number(),
      jabatanId: z.number(),
      pelatihanId: z.number(),
      tahunPelatihanId: z.number(),
      lemdik: z.string(),
      handphone: z.string()
    })

    const parsed = AlumniSchema.safeParse(body)

    if (!parsed.success) {
      return createError({
        statusCode: 400,
        statusMessage: 'Data tidak valid',
        data: parsed.error.flatten()
      })
    }

    // Cek NIP duplikat
    const existing = await db
      .select()
      .from(alumni)
      .where(eq(alumni.nipNrpNik, parsed.data.nipNrpNik))

    if (existing.length > 0) {
      return createError({
        statusCode: 409,
        statusMessage: 'NIP/NRP/NIK sudah terdaftar',
        data: parsed.data.nipNrpNik
      })
    }

    try {
      await db.insert(alumni).values(parsed.data)
      return { status: 'success', message: 'Data alumni berhasil disimpan' }
    } catch (error) {
      console.error('Insert error:', error)
      return createError({
        statusCode: 500,
        statusMessage: 'Gagal menyimpan data alumni',
        data: error
      })
    }
  }

  return createError({
    statusCode: 405,
    statusMessage: 'Method tidak diizinkan'
  })
})
