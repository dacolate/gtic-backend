import vine from '@vinejs/vine'

export const gradeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(1)
      .maxLength(64)
      .unique(async (query, field) => {
        const grade = await query.from('grades').where('name', field).first()
        return !grade
      }),
    description: vine.string().optional(),
    pricing_id: vine.number(),
    course_id: vine.number(),
  })
)
