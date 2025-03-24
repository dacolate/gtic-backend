import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const StudentModifValidator = vine.compile(
  vine.object({
    // Student Info
    name: vine.string().minLength(3).maxLength(64),
    firstname: vine.string().minLength(3).maxLength(64),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().regex(/^\+?[0-9]{7,15}$/),
    address: vine.string().optional(),
    gender: vine.enum(['M', 'F']),
    cni: vine.string().optional(),
    nationality: vine.string(),
    birthday: vine.string().transform((date) => DateTime.fromISO(date)),

    // Parent Info
    parentName: vine.string().minLength(2).optional(),
    parentPhone: vine
      .string()
      .regex(/^\+?[0-9]{7,15}$/)
      .optional(),
    parentAddress: vine.string().minLength(5).optional(),
    parentEmail: vine.string().email().optional(),
  })
)
