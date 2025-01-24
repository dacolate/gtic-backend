import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

// const instalmentDateValidator = vine.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const pricingValidator = vine.compile(
  vine.object({
    description: vine.string().optional(),
    register_fee: vine.number(),
    instalment_1_fee: vine.number().positive(),
    instalment_2_fee: vine.number().positive(),
    instalment_1_deadline: vine.string().transform((date) => DateTime.fromISO(date)),
    instalment_2_deadline: vine.string().transform((date) => DateTime.fromISO(date)),
  })
)
