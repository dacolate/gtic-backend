import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const studentValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(64),
    firstname: vine.string().minLength(3).maxLength(64),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (query, field) => {
        const student = await query.from('students').where('email', field).first()
        return !student
      })
      .optional(),
    phone: vine
      .string()
      .regex(/^\+?[0-9]{7,15}$/)
      .unique(async (query, field) => {
        const student = await query.from('students').where('phone', field).first()
        return !student
      }),
    address: vine.string().optional(),
    gender: vine.enum(['M', 'F']),
    cni: vine.string().optional(),
    nationality: vine.string(),
    birthday: vine.string().transform((date) => DateTime.fromISO(date)),
  })
)

export const studentModifyValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(64),
    firstname: vine.string().minLength(3).maxLength(64),
    email: vine.string().email().normalizeEmail().optional(),
    phone: vine.string().regex(/^\+?[0-9]{7,15}$/),
    address: vine.string().optional(),
    gender: vine.enum(['M', 'F']),
    cni: vine.string().optional(),
    nationality: vine.string(),
    birthday: vine.string().transform((date) => DateTime.fromISO(date)),

    parentName: vine.string().minLength(3).maxLength(64).optional(),
    parentPhone: vine
      .string()
      .regex(/^\+?[0-9]{7,15}$/)
      .optional(), // Transform empty string to null
    parentAddress: vine.string().optional(), // Transform empty string to null
    parentEmail: vine.string().email().normalizeEmail().optional(), // Transform empty string to null
  })
)
