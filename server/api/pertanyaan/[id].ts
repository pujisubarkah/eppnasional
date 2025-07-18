import { db } from '../../database/db'
import { questions, question_options } from '../../database/schema/pertanyaan'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (isNaN(id)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid question ID' }))
  }

  try {
    const question = await db
      .select()
      .from(questions)
      .where(eq(questions.id, id))

    if (question.length === 0) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Question not found' }))
    }

    const options = await db
      .select()
      .from(question_options)
      .where(eq(question_options.question_id, id))
      .orderBy(asc(question_options.ordering))

    return {
      ...question[0],
      options,
    }
  } catch (error) {
    console.error('Error fetching question by ID:', error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error' }))
  }
})
