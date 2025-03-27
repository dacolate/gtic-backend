import vine from '@vinejs/vine'

export const courseValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(64)
      .unique(async (query, field) => {
        const course = await query.from('courses').where('name', field).first()
        return !course
      }),
    description: vine.string().optional(),
    pricing_id: vine.number().optional(),
    // .exists(async (query, field) => {
    //   const price = await query.from('pricings').where('id', field).first()
    //   return price
    // })
  })
)
