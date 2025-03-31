import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Payment from '#models/payment'
import { paymentValidator } from '#validators/payment'
import StudentClass from '#models/student_class'
import { ActivityLogger } from '#services/activity_logger'

export default class PaymentController {
  modInstance = Payment
  async index({ response }: HttpContext) {
    const payment = await Payment.query()
      .preload('student')
      .preload('student_class', (query) => {
        query.preload('pricing')
      })
      .preload('class', (query) => {
        query
          .preload('grade', (quer) => {
            quer.preload('course')
          })
          .preload('pricing')
          .preload('teacher')
      })
    if (payment.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No payment found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(payment, 'Payments fetched successfully'))
  }

  async store({ auth, request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(paymentValidator)

      const studentClass = await StudentClass.query()
        .where('classId', data.classId)
        .andWhere('studentId', data.studentId)
        .first()
      console.log(studentClass)

      if (studentClass) {
        studentClass.remainingPayment = (studentClass.remainingPayment ?? 0) - data.amount
      }

      const payment = await Payment.create({ ...data, studentClassId: studentClass?.id })

      console.log(payment)

      ActivityLogger.logCreate(auth.user?.id, this.modInstance, null, payment.id)

      return response
        .status(201)
        .json(RequestResponse.success(payment, 'Payment created successfully'))
    } catch (error) {
      // Catch validation errors
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response
          .status(422)
          .json(RequestResponse.failure(error.messages, 'Validation failed'))
      }
      return response
        .status(400)
        .json(RequestResponse.failure(null, error.messages || 'An unexpected error occurred'))
    }
  }

  async show({ response }: HttpContext) {
    const payment = await Payment.query()
      .preload('student')
      .preload('student_class', (query) => {
        query.preload('pricing')
      })
      .preload('class', (query) => {
        query
          .preload('grade', (quer) => {
            quer.preload('course')
          })
          .preload('pricing')
          .preload('teacher')
      })
      .first()
    if (!payment) {
      return response.status(404).json(RequestResponse.failure(null, 'Payment not found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(payment, 'Payment fetched successfully'))
  }

  async update({ auth, params, request, response }: HttpContext) {
    try {
      const payment = await Payment.find(params.id)
      if (!payment) {
        return response.status(404).json(RequestResponse.failure(null, 'Payment not found'))
      }

      const data = await request.validateUsing(paymentValidator)

      payment.merge(data)
      await payment.save()

      ActivityLogger.logUpdate(auth.user?.id, this.modInstance, null, payment.id)

      return response
        .status(200)
        .json(RequestResponse.success(payment, 'Payment updated successfully'))
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

  async delete({ auth, params, response }: HttpContext) {
    const payment = await Payment.find(params.id)
    if (!payment) {
      return response.status(404).json(RequestResponse.failure(null, 'Payment not found'))
    }
    await payment.delete()
    ActivityLogger.logDelete(auth.user?.id, this.modInstance, null, payment.id)
    return response.status(200).json(RequestResponse.success(null, 'Payment deleted successfully'))
  }
}
