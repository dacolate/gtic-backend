import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const classValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(64)
      .unique(async (query, field) => {
        const myclass = await query.from('classes').where('name', field).first()
        return !myclass
      }),
    description: vine.string().optional(),
    teacher_id: vine.number(),
    start_date: vine
      .string()
      .transform((date) => DateTime.fromISO(date))
      .optional(),
    expected_duration: vine.number(),
    grade_id: vine.number().optional(),
    course_id: vine.number().optional().requiredIfMissing('grade_id'),
  })
)
