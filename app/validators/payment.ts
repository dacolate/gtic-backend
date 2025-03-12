import vine from '@vinejs/vine'

export const paymentValidator = vine.compile(
  vine.object({
    studentId: vine.number(),
    classId: vine.number(),
    amount: vine.number().positive(),
    paymentMethod: vine.enum(['OM', 'MOMO', 'Cash', 'Bank', 'Other']),
    details: vine.string().optional(),
  })
)
