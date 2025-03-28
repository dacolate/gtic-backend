// import vine from '@vinejs/vine'
// import { DateTime } from 'luxon'

export type ClassSchema = {
  name: string
  description?: string
  teacher_id: number
  start_date: Date
  expected_duration: number
  grade_id: number
  course_id: number
  registrationFee: number
  firstInstalmentFee: number
  firstInstalmentDeadline: Date
  secondInstalmentFee: number
  secondInstalmentDeadline: Date
}

// export const createClassValidator = vine.object({
//   // Class Info
//   name: vine.string().minLength(3),
//   description: vine.string().optional(),
//   teacher_id: vine.number().positive(),
//   start_date: vine.string().isoDate(),
//   expected_duration: vine.number().min(0),
//   grade_id: vine.number().positive(),
//   course_id: vine.number().positive(),

//   // Pricing
//   registrationFee: vine.number().positive(),
//   firstInstalmentFee: vine.number().positive(),
//   firstInstalmentDeadline: vine
//     .string()
//     .transform((date) => DateTime.fromISO(date))
//     .optional(),
//   secondInstalmentDeadline: vine
//     .string()
//     .transform((date) => DateTime.fromISO(date))
//     .optional(),
//   secondInstalmentFee: vine.number().positive(),
// })
