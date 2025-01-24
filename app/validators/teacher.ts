import vine from '@vinejs/vine'

export const teacherValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(64)
      .unique(async (query, field) => {
        const teacher = await query.from('teachers').where('name', field).first()
        return !teacher
      }),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (query, field) => {
        const teacher = await query.from('teachers').where('email', field).first()
        return !teacher
      }),
    phone: vine
      .string()
      .regex(/^\d{9}$/)
      .unique(async (query, field) => {
        const teacher = await query.from('teachers').where('phone', field).first()
        return !teacher
      }), // 9 digits
  })
)
