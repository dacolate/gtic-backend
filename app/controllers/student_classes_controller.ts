// import type { HttpContext } from '@adonisjs/core/http'

import Pricing from '#models/pricing'
import StudentClass from '#models/student_class'
import { studentClassValidator } from '#validators/student_class'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { RequestResponse } from '../../types.js'
import db from '@adonisjs/lucid/services/db'
import Class from '#models/class'
import Payment from '#models/payment'
import { DateTime } from 'luxon'

export default class StudentClassesController {
  //   async store({ request, response }: HttpContext) {
  //     let payload

  //     // Validate the request data and catch validation errors
  //     try {
  //       payload = await request.validateUsing(studentClassValidator)
  //       console.log(payload)
  //     } catch (error) {
  //       // Catch validation errors
  //       console.log('err', error)
  //       if (error instanceof errors.E_VALIDATION_ERROR) {
  //         return response
  //           .status(422)
  //           .json(RequestResponse.failure(error.messages, 'Validation failed'))
  //       }
  //       return response
  //         .status(400)
  //         .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
  //     }

  //     const trx = await db.transaction()

  //     try {
  //       const pricing = await Pricing.firstOrCreate(
  //         {
  //           registerFee: payload.registrationFee,
  //           instalment1Fee: payload.firstInstalmentFee,
  //           instalment2Fee: payload.secondInstalmentFee,
  //           instalment1Deadline: payload.firstInstalmentDeadline,
  //           instalment2Deadline: payload.secondInstalmentDeadline,
  //         },
  //         {
  //           registerFee: payload.registrationFee,
  //           instalment1Fee: payload.firstInstalmentFee,
  //           instalment2Fee: payload.secondInstalmentFee,
  //           instalment1Deadline: payload.firstInstalmentDeadline,
  //           instalment2Deadline: payload.secondInstalmentDeadline,
  //         },
  //         { client: trx }
  //       )

  //       const classs = await Class.find(payload.classId)

  //       // console.log(`Processing class ID: ${studentClass.id}`) // Debug log

  //       const payments = await Payment.query()
  //         .where('studentId', payload.studentId)
  //         .where('classId', payload.classId)
  //         .sum('amount')
  //         .first()

  //       // console.log(`Payments for class ID ${studentClass.id}:`, payments) // Debug log

  //       const studentClass = await StudentClass.firstOrCreate({
  //         classId: payload.classId,
  //         studentId: payload.studentId,
  //         pricingId: pricing.id,
  //         startDate: payload.startDate || classs?.startDate,
  //       })

  //       if (!pricing) {
  //         console.log(`Pricing not found for class ID: ${studentClass.id}`) // Debug log
  //         studentClass.paymentStatus = 'pricing not found'
  //         studentClass.daysTilDeadline = null // No deadline if pricing is missing
  //         await studentClass.save()
  //       }

  //       const now = DateTime.now()
  //       const totalFee =
  //         Number(pricing.registerFee) +
  //         Number(pricing.instalment1Fee) +
  //         Number(pricing.instalment2Fee)
  //       const totalPaid = Number(payments?.$extras.sum) || 0

  //       // console.log(`Total fee: ${totalFee}, Total paid: ${totalPaid}`) // Debug log

  //       let paymentStatus: string
  //       let daysTilDeadline: number | null = null
  //       let nextDeadline: DateTime | null = null
  //       let remainingPayment: number

  //       if (totalPaid >= totalFee) {
  //         // Fully paid
  //         paymentStatus = 'Up to date'
  //         daysTilDeadline = null // Special value for fully paid
  //         nextDeadline = null // Special value for fully paid
  //         remainingPayment = 0
  //       } else if (totalPaid < Number(pricing.registerFee) + Number(pricing.instalment1Fee)) {
  //         // Not paid first installment
  //         if (now > pricing.instalment1Deadline) {
  //           // Missed first deadline
  //           paymentStatus = 'Not up to date'
  //           daysTilDeadline = Math.floor(now.diff(pricing.instalment1Deadline, 'days').days)
  //           nextDeadline = pricing.instalment1Deadline
  //           remainingPayment = totalFee - totalPaid
  //         } else {
  //           // Up to date for first installment
  //           paymentStatus = 'Up to date'
  //           daysTilDeadline = Math.floor(pricing.instalment1Deadline.diff(now, 'days').days)
  //           nextDeadline = pricing.instalment1Deadline
  //           remainingPayment = totalFee - totalPaid
  //         }
  //       } else if (totalPaid < totalFee) {
  //         // Paid first installment but not fully paid
  //         if (now > pricing.instalment2Deadline) {
  //           // Missed second deadline
  //           paymentStatus = 'Not up to date'
  //           daysTilDeadline = Math.floor(now.diff(pricing.instalment2Deadline, 'days').days)
  //           nextDeadline = pricing.instalment2Deadline
  //           remainingPayment = totalFee - totalPaid
  //         } else {
  //           // Up to date for second installment
  //           paymentStatus = 'Up to date'
  //           daysTilDeadline = Math.floor(pricing.instalment2Deadline.diff(now, 'days').days)
  //           nextDeadline = pricing.instalment2Deadline
  //           remainingPayment = totalFee - totalPaid
  //         }
  //       } else {
  //         // Default case (should not happen)
  //         paymentStatus = 'Unknown'
  //         daysTilDeadline = null
  //         nextDeadline = null
  //         remainingPayment = 0
  //       }

  //       // Update the studentClass
  //       studentClass.paymentStatus = paymentStatus
  //       studentClass.daysTilDeadline = daysTilDeadline
  //       studentClass.nextdeadline = nextDeadline
  //       studentClass.remainingPayment = remainingPayment

  //       // console.log(
  //       //   `Updated paymentStatus for class ID: ${studentClass.id} to ${paymentStatus}, daysTilDeadline: ${daysTilDeadline}`
  //       // ) // Debug log

  //       // Save the updated studentClass
  //       await studentClass.save()

  //       return response
  //         .status(201)
  //         .json(RequestResponse.success(studentClass, 'Affected successfully'))
  //     } catch (error) {
  //       // Catch validation errors
  //       if (error instanceof errors.E_VALIDATION_ERROR) {
  //         return response
  //           .status(422)
  //           .json(RequestResponse.failure(error.messages, 'Validation failed'))
  //       }
  //       return response
  //         .status(400)
  //         .json(RequestResponse.failure(null, error.messages || 'An unexpected error occurred'))
  //     }
  //   }
  async store({ request, response }: HttpContext) {
    let payload

    // Validate the request data and catch validation errors
    try {
      payload = await request.validateUsing(studentClassValidator)
      console.log('Validated payload:', payload)
    } catch (error) {
      console.error('Validation error:', error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, 'An unexpected error occurred during validation'))
    }

    const trx = await db.transaction()

    try {
      // Create or find pricing
      const pricing = await Pricing.firstOrCreate(
        {
          registerFee: payload.registrationFee,
          instalment1Fee: payload.firstInstalmentFee,
          instalment2Fee: payload.secondInstalmentFee,
          instalment1Deadline: payload.firstInstalmentDeadline,
          instalment2Deadline: payload.secondInstalmentDeadline,
        },
        {
          registerFee: payload.registrationFee,
          instalment1Fee: payload.firstInstalmentFee,
          instalment2Fee: payload.secondInstalmentFee,
          instalment1Deadline: payload.firstInstalmentDeadline,
          instalment2Deadline: payload.secondInstalmentDeadline,
        },
        { client: trx }
      )
      console.log('Pricing created/found:', pricing)

      // Find the class
      const classs = await Class.find(payload.classId)
      if (!classs) {
        throw new Error(`Class with ID ${payload.classId} not found`)
      }
      console.log('Class found:', classs)

      // Calculate total payments made by the student for this class
      const payments = await Payment.query()
        .where('studentId', payload.studentId)
        .where('classId', payload.classId)
        .sum('amount')
        .first()
      console.log('Payments:', payments)

      // Create or find student class
      const studentClass = await StudentClass.firstOrCreate(
        {
          classId: payload.classId,
          studentId: payload.studentId,
          pricingId: pricing.id,
          startDate: payload.startDate || classs.startDate,
        },
        {
          classId: payload.classId,
          studentId: payload.studentId,
          pricingId: pricing.id,
          startDate: payload.startDate || classs.startDate,
        },
        { client: trx }
      )
      console.log('StudentClass created/found:', studentClass)

      // Check if pricing exists
      if (!pricing) {
        console.error('Pricing not found for class ID:', studentClass.id)
        studentClass.paymentStatus = 'pricing not found'
        studentClass.daysTilDeadline = null
        await studentClass.save()
      }

      // Calculate payment status and deadlines
      const now = DateTime.now()
      const totalFee =
        Number(pricing.registerFee) +
        Number(pricing.instalment1Fee) +
        Number(pricing.instalment2Fee)
      const totalPaid = Number(payments?.$extras.sum) || 0
      console.log('Total fee:', totalFee, 'Total paid:', totalPaid)

      let paymentStatus: string
      let daysTilDeadline: number | null = null
      let nextDeadline: DateTime | null = null
      let remainingPayment: number

      if (totalPaid >= totalFee) {
        paymentStatus = 'Up to date'
        remainingPayment = 0
      } else if (totalPaid < Number(pricing.registerFee) + Number(pricing.instalment1Fee)) {
        if (now > pricing.instalment1Deadline) {
          paymentStatus = 'Not up to date'
          daysTilDeadline = Math.floor(now.diff(pricing.instalment1Deadline, 'days').days)
          nextDeadline = pricing.instalment1Deadline
        } else {
          paymentStatus = 'Up to date'
          daysTilDeadline = Math.floor(pricing.instalment1Deadline.diff(now, 'days').days)
          nextDeadline = pricing.instalment1Deadline
        }
        remainingPayment = totalFee - totalPaid
      } else if (totalPaid < totalFee) {
        if (now > pricing.instalment2Deadline) {
          paymentStatus = 'Not up to date'
          daysTilDeadline = Math.floor(now.diff(pricing.instalment2Deadline, 'days').days)
          nextDeadline = pricing.instalment2Deadline
        } else {
          paymentStatus = 'Up to date'
          daysTilDeadline = Math.floor(pricing.instalment2Deadline.diff(now, 'days').days)
          nextDeadline = pricing.instalment2Deadline
        }
        remainingPayment = totalFee - totalPaid
      } else {
        paymentStatus = 'Unknown'
        remainingPayment = 0
      }

      // Update the studentClass
      studentClass.paymentStatus = paymentStatus
      studentClass.daysTilDeadline = daysTilDeadline
      studentClass.nextdeadline = nextDeadline
      studentClass.remainingPayment = remainingPayment
      await studentClass.save()
      console.log('Updated StudentClass:', studentClass)

      // Commit the transaction
      await trx.commit()

      return response
        .status(201)
        .json(RequestResponse.success(studentClass, 'Student class created successfully'))
    } catch (error) {
      // Rollback the transaction in case of error
      await trx.rollback()
      console.error('Error in store method:', error)

      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error.message || 'An unexpected error occurred'))
    }
  }
}
