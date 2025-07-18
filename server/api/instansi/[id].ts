// server/api/instansi/category/[id].ts (misal pakai Nuxt 3)
import { db } from '~/server/database/db'
import { instansi } from '~/server/database/schema/instansi'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  console.log('Event context:', event.context)
  console.log('Raw param id:', getRouterParam(event, 'id'))

  const categoryId = Number(getRouterParam(event, 'id'))
  console.log('Requested categoryId:', categoryId)

  if (isNaN(categoryId)) {
    console.error('Invalid category ID:', getRouterParam(event, 'id'))
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category ID',
    })
  }

  try {
    const data = await db
      .select()
      .from(instansi)
      .where(eq(instansi.agency_category_id, categoryId))
    return data
  } catch (err) {
    console.error('DB error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Database error',
    })
  }
})
