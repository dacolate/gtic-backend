import vine from '@vinejs/vine'

export const parentValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(64)
      .unique(async (query, field) => {
        const parent = await query.from('parents').where('name', field).first()
        return !parent
      }),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (query, field) => {
        const parent = await query.from('parents').where('email', field).first()
        return !parent
      })
      .optional(),
    phone: vine
      .string()
      .regex(/^\+?[0-9]{7,15}$/)
      .unique(async (query, field) => {
        const teacher = await query.from('teachers').where('phone', field).first()
        return !teacher
      }),
  })
)
