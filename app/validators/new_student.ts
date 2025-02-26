import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const newStudentValidator = vine.compile(
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

    // Class Attribution
    course: vine.string().minLength(1),
    grade: vine.string().minLength(1),
    class: vine.number(),

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

    // Payment
    paymentAmount: vine.number().min(0),
    paymentMethod: vine.enum(['OM', 'MOMO', 'Cash', 'Bank', 'Other']),
  })
)
