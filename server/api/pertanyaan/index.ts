// server/api/pertanyaan.ts

import { db } from '../../database/db';
import { questions, question_options } from '../../database/schema/pertanyaan'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const allQuestions = await db
      .select()
      .from(questions)
      .orderBy(asc(questions.id)) // ← Urut berdasarkan ID pertanyaan

    const result = await Promise.all(
      allQuestions.map(async (q) => {
        const options = await db
          .select()
          .from(question_options)
          .where(eq(question_options.question_id, q.id))
          .orderBy(asc(question_options.ordering)) // masih bisa diurut juga kalau mau

        return {
          ...q,
          options,
        }
      })
    )

    return result
  } catch (error) {
    console.error('Error fetching questions:', error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error' }))
  }
})
