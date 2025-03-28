import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

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
    course_id: vine.number(),
  })
)

export const createGradeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    description: vine.string().optional(),
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
    courseId: vine.number().positive(),
  })
)

export const updateGradeValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).optional(),
    description: vine.string().optional(),
    registrationFee: vine.number().min(0).optional(),
    firstInstalmentFee: vine.number().min(0).optional(),
    firstInstalmentDeadline: vine.date().optional(),
    secondInstalmentFee: vine.number().min(0).optional(),
    secondInstalmentDeadline: vine.date().optional(),
  })
)
