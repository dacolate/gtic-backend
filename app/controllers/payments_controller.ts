import type { HttpContext } from '@adonisjs/core/http'
import { RequestResponse } from '../../types.js'
import { errors } from '@vinejs/vine'
import Payment from '#models/payment'
import { paymentValidator } from '#validators/payment'

export default class PaymentController {
  async index({ response }: HttpContext) {
    const payment = await Payment.query().preload('student').preload('student_class')
    if (payment.length === 0) {
      return response.status(404).json(RequestResponse.failure(null, 'No payment found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(payment, 'Payments fetched successfully'))
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(paymentValidator)

      const payment = await Payment.create(data)

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

  async show({ params, response }: HttpContext) {
    const payment = await Payment.query()
      .where('id', params.id)
      .preload('student')
      .preload('student_class')
      .first()
    if (!payment) {
      return response.status(404).json(RequestResponse.failure(null, 'Payment not found'))
    }
    return response
      .status(200)
      .json(RequestResponse.success(payment, 'Payment fetched successfully'))
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const payment = await Payment.find(params.id)
      if (!payment) {
        return response.status(404).json(RequestResponse.failure(null, 'Payment not found'))
      }

      const data = await request.validateUsing(paymentValidator)

      payment.merge(data)
      await payment.save()

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

  async delete({ params, response }: HttpContext) {
    const payment = await Payment.find(params.id)
    if (!payment) {
      return response.status(404).json(RequestResponse.failure(null, 'Payment not found'))
    }
    await payment.delete()
    return response.status(200).json(RequestResponse.success(null, 'Payment deleted successfully'))
  }
}
