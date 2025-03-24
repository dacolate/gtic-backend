import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

// const instalmentDateValidator = vine.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const studentClassValidator = vine.compile(
  vine.object({
    // Pricing
    registrationFee: vine.number().positive(),
    firstInstalmentFee: vine.number().positive(),
    firstInstalmentDeadline: vine
      .string()
      .transform((date) => DateTime.fromISO(date))
      .optional(),
    secondInstalmentDeadline: vine
      .string()
      .transform((date) => DateTime.fromISO(date))
      .optional(),
    secondInstalmentFee: vine.number().positive(),
    classId: vine.number(),
    studentId: vine.number(),
    startDate: vine
      .string()
      .transform((date) => DateTime.fromISO(date))
      .optional(),
  })
)
