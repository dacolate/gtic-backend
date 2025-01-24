import vine from '@vinejs/vine'

export const studentValidator = vine.compile(
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
      .regex(/^[0-9]{9}$/)
      .unique(async (query, field) => {
        const parent = await query.from('parents').where('phone', field).first()
        return !parent
      }),
    address: vine.string(),
  })
)
