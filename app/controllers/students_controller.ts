import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { studentValidator } from '#validators/student'
import { errors } from '@vinejs/vine'
import Student from '#models/student'
import StudentClass from '#models/student_class'
import Payment from '#models/payment'
import { DateTime } from 'luxon'

interface UpdateStudentClassPaymentStatusProps {
  id?: number
}

async function updateStudentClassPaymentStatus({ id }: UpdateStudentClassPaymentStatusProps) {
  // console.log('updateStudentClassPaymentStatus called') // Debug log

  const stds = id ? await Student.query().where('id', id) : await Student.query()
  // console.log(`Found ${stds.length} students`) // Debug log

  for (const student of stds) {
    // console.log(`Processing student ID: ${student.id}`) // Debug log

    // Load the related studentClasses for the current student
    const studentClasses = await StudentClass.query()
      .where('studentId', student.id)
      .preload('pricing') // Preload pricing if needed

    // console.log(`Found ${studentClasses.length} classes for student ${student.id}`) // Debug log

    // Update paymentStatus and days_til_deadline for each studentClass
    for (const studentClass of studentClasses) {
      // console.log(`Processing class ID: ${studentClass.id}`) // Debug log

      const payments = await Payment.query()
        .where('studentId', studentClass.studentId)
        .where('classId', studentClass.classId)
        .sum('amount')
        .first()

      // console.log(`Payments for class ID ${studentClass.id}:`, payments) // Debug log

      const pricing = studentClass.pricing
      if (!pricing) {
        console.log(`Pricing not found for class ID: ${studentClass.id}`) // Debug log
        studentClass.paymentStatus = 'pricing not found'
        studentClass.daysTilDeadline = null // No deadline if pricing is missing
        await studentClass.save()
        continue
      }

      const now = DateTime.now()
      const totalFee =
        Number(pricing.registerFee) +
        Number(pricing.instalment1Fee) +
        Number(pricing.instalment2Fee)
      const totalPaid = Number(payments?.$extras.sum) || 0

      // console.log(`Total fee: ${totalFee}, Total paid: ${totalPaid}`) // Debug log

      let paymentStatus: string
      let daysTilDeadline: number | null = null
      let nextDeadline: DateTime | null = null
      let remainingPayment: number

      if (totalPaid >= totalFee) {
        // Fully paid
        paymentStatus = 'Up to date'
        daysTilDeadline = null // Special value for fully paid
        nextDeadline = null // Special value for fully paid
        remainingPayment = 0
      } else if (totalPaid < Number(pricing.registerFee) + Number(pricing.instalment1Fee)) {
        // Not paid first installment
        if (now > pricing.instalment1Deadline) {
          // Missed first deadline
          paymentStatus = 'Not up to date'
          daysTilDeadline = Math.floor(now.diff(pricing.instalment1Deadline, 'days').days)
          nextDeadline = pricing.instalment1Deadline
          remainingPayment = totalFee - totalPaid
        } else {
          // Up to date for first installment
          paymentStatus = 'Up to date'
          daysTilDeadline = Math.floor(pricing.instalment1Deadline.diff(now, 'days').days)
          nextDeadline = pricing.instalment1Deadline
          remainingPayment = totalFee - totalPaid
        }
      } else if (totalPaid < totalFee) {
        // Paid first installment but not fully paid
        if (now > pricing.instalment2Deadline) {
          // Missed second deadline
          paymentStatus = 'Not up to date'
          daysTilDeadline = Math.floor(now.diff(pricing.instalment2Deadline, 'days').days)
          nextDeadline = pricing.instalment2Deadline
          remainingPayment = totalFee - totalPaid
        } else {
          // Up to date for second installment
          paymentStatus = 'Up to date'
          daysTilDeadline = Math.floor(pricing.instalment2Deadline.diff(now, 'days').days)
          nextDeadline = pricing.instalment2Deadline
          remainingPayment = totalFee - totalPaid
        }
      } else {
        // Default case (should not happen)
        paymentStatus = 'Unknown'
        daysTilDeadline = null
        nextDeadline = null
        remainingPayment = 0
      }

      // Update the studentClass
      studentClass.paymentStatus = paymentStatus
      studentClass.daysTilDeadline = daysTilDeadline
      studentClass.nextdeadline = nextDeadline
      studentClass.remainingPayment = remainingPayment

      // console.log(
      //   `Updated paymentStatus for class ID: ${studentClass.id} to ${paymentStatus}, daysTilDeadline: ${daysTilDeadline}`
      // ) // Debug log

      // Save the updated studentClass
      await studentClass.save()
    }
  }
}

export default class StudentsController {
  async index({ response }: HttpContext) {
    await updateStudentClassPaymentStatus({})
    const students = await Student.query()
      .preload('classes', (query) => {
        query
          .preload('course')
          .preload('teacher')
          .preload('grade', (query2) => {
            query2.preload('pricing')
          })
      })
      .preload('parents')
      .preload('attendances')
      .preload('payments')
      .preload('student_classes', (query) => {
        query.preload('pricing')
      })
    if (students.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No students found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(students, 'Students fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      console.log(3) // Debug log
      const data = await request.validateUsing(studentValidator)

      const student = await Student.create(data)

      return response
        .status(201)
        .json(RequestResponse.success(student, 'Student created successfully'))
    } catch (error) {
      // Catch validation errors
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
    }
  }

  async show({ params, response }: HttpContext) {
    await updateStudentClassPaymentStatus({ id: params.id })
    const student = await Student.query()
      .where('id', params.id)
      .preload('classes', (query) => {
        query
          .preload('course')
          .preload('teacher')
          .preload('grade', (query2) => {
            query2.preload('pricing')
          })
      })
      .preload('parents')
      .preload('attendances')
      .preload('payments')
      .preload('student_classes', (query) => {
        query.preload('pricing')
      })
      .first()
    if (!student) {
      return response.status(404).json(RequestResponse.failure(null, 'Student not found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(student, 'Student fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const student = await Student.find(params.id)
      if (!student) {
        return response.status(404).json(RequestResponse.failure(null, 'Student not found'))
      }

      const data = await request.validateUsing(studentValidator)

      student.merge(data)
      await student.save()

      return response
        .status(200)
        .json(RequestResponse.success(student, 'Student updated successfully'))
    } catch (error) {
      // Catch validation errors
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error || 'An unexpected error occurred'))
    }
  }

  async delete({ params, response }: HttpContext) {
    const student = await Student.find(params.id)
    if (!student) {
      return response.status(404).json(RequestResponse.failure(null, 'Student not found'))
    }
    await student.delete()
    return response.status(200).json(RequestResponse.success(null, 'Student deleted successfully'))
  }
}
